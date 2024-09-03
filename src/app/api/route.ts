import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import { APIAction } from '@/services/api';

let app = getApps()[0];
// Initialize Firebase Admin SDK
if (!app) {
  console.log('Initializing Firebase app');
  const firebaseConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  };
  console.log('Firebase config:', firebaseConfig);

  try {
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase app:', error);
    throw error;
  }
}

const db = getDatabase(app);

console.log('Database reference obtained');

// Test database connection
db.ref('.info/connected').on('value', (snapshot) => {
  if (snapshot.val() === true) {
    console.log('Connected to Firebase');
  } else {
    console.log('Not connected to Firebase');
  }
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const { action, data } = await request.json();
  console.log('Received action:', action, 'with data:', data);

  switch (action) {
    case APIAction.CREATE_ASSISTANT:
      console.log('Calling createAssistant');
      return createAssistant(data);
    case APIAction.GET_AGENTS:
      return getAgents(data);
    case APIAction.DELETE_ASSISTANT:
      return deleteAssistant(data);
    case APIAction.CREATE_THREAD:
      return createThread(data);
    case APIAction.GET_THREADS:
      return getThreadsByUserAndChatbot(data.userId, data.chatbotId);
    case APIAction.ADD_MESSAGE:
      return addMessage(data);
    case APIAction.RUN_ASSISTANT:
      return runAssistantWithStream(data);
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}

async function createAssistant(data: { name: string, description: string, instructions: string, userId: string }) {
  console.log('Creating assistant with data:', data);
  const assistant = await openai.beta.assistants.create({
    name: data.name,
    description: data.description,
    instructions: data.instructions,
    model: "gpt-4-turbo-preview",
  });
  console.log('Assistant created in OpenAI:', assistant.id);

  try {
    console.log('Attempting to save assistant to database...');
    const assistantData = {
      id: assistant.id,
      name: assistant.name,
      description: assistant.description,
      instructions: assistant.instructions,
      ownerId: data.userId,
    };
    const updates: { [key: string]: any } = {};
    updates[`agents/${data.userId}/${assistant.id}`] = assistantData;

    await db.ref().update(updates);
    console.log('Assistant saved to database:', assistant.id);
  } catch (error) {
    console.error('Error saving assistant to database:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    await openai.beta.assistants.del(assistant.id);
    throw error;
  }

  console.log('Returning response');
  return NextResponse.json(assistant);
}

async function getAgents(data: { userId: string }) {
  const snapshot = await db.ref(`agents/${data.userId}`).once('value');
  const agents = snapshot.val() || {};
  return NextResponse.json(Object.values(agents));
}

async function deleteAssistant(data: { assistantId: string, userId: string }) {
  await openai.beta.assistants.del(data.assistantId);
  await db.ref(`agents/${data.userId}/${data.assistantId}`).remove();
  return NextResponse.json({ success: true });
}

async function createThread(data: { userId: string, chatbotId: string }) {
  const thread = await openai.beta.threads.create();

  const threadData = {
    id: thread.id,
    userId: data.userId,
    chatbotId: data.chatbotId,
    createdAt: Date.now(),
    messages: [],
  };

  const updates: { [key: string]: any } = {};
  updates[`threads/${thread.id}`] = threadData;
  updates[`userThreads/${data.userId}/${thread.id}`] = true;
  updates[`chatbotThreads/${data.chatbotId}/${thread.id}`] = true;

  await db.ref().update(updates);

  return NextResponse.json(threadData);
}

async function addMessage(data: { threadId: string, content: string }) {
  const message = await openai.beta.threads.messages.create(data.threadId, {
    role: "user",
    content: data.content,
  });

  const messageData = {
    role: message.role,
    content: data.content,
    created: Date.now(),
  }

  await db.ref(`threads/${data.threadId}/messages`).push(messageData);

  return NextResponse.json(message);
}

async function runAssistantWithStream(data: { threadId: string; assistantId: string; userId: string }) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const run = await openai.beta.threads.runs.create(data.threadId, {
          assistant_id: data.assistantId,
        });

        while (true) {
          const runStatus = await openai.beta.threads.runs.retrieve(data.threadId, run.id);
          if (runStatus.status === 'completed') {
            const messages = await openai.beta.threads.messages.list(data.threadId);
            const lastMessage = messages.data[0];
            if (lastMessage.role === 'assistant') {
              const content = lastMessage.content[0];
              if ('text' in content) {
                const messageText = content.text.value;
                controller.enqueue(encoder.encode(messageText));
                
                // Update the database with the new message
                await db.ref(`threads/${data.threadId}/messages`).push({
                  role: 'assistant',
                  content: messageText,
                  created: Date.now(),
                });
              } else if ('image_file' in content) {
                controller.enqueue(encoder.encode('Image file received'));
                // Handle image file if needed
              }
            }
            break;
          } else if (runStatus.status === 'failed') {
            throw new Error('Run failed');
          }
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
        }

        controller.close();
      } catch (error) {
        console.error('Error in runAssistantWithStream:', error);
        controller.error(error);
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

// get last messages from firebase
async function getThreadMessages(threadId: string) {

}

async function getThreadsByUser(userId: string) {
  const snapshot = await db.ref(`userThreads/${userId}`).once('value');
  const threadIds = Object.keys(snapshot.val() || {});
  return getThreadsByIds(threadIds);
}

async function getThreadsByChatbot(chatbotId: string) {
  const snapshot = await db.ref(`chatbotThreads/${chatbotId}`).once('value');
  const threadIds = Object.keys(snapshot.val() || {});
  return getThreadsByIds(threadIds);
}

async function getThreadsByUserAndChatbot(userId: string, chatbotId: string) {
  try {
    const userSnapshot = await db.ref(`userThreads/${userId}`).once('value');
    const chatbotSnapshot = await db.ref(`chatbotThreads/${chatbotId}`).once('value');
    const userThreadIds = Object.keys(userSnapshot.val() || {});
    const chatbotThreadIds = new Set(Object.keys(chatbotSnapshot.val() || {}));
    const threadIds = userThreadIds.filter(id => chatbotThreadIds.has(id));
    const threads = await getThreadsByIds(threadIds);
    
    console.log('Filtered threads:', threads);
    return NextResponse.json(threads);
  } catch (error) {
    console.error('Error in getThreadsByUserAndChatbot:', error);
    return NextResponse.json({ error: 'Failed to fetch threads' }, { status: 500 });
  }
}

async function getThreadsByIds(threadIds: string[]) {
  const threads = await Promise.all(
    threadIds.map(id => db.ref(`threads/${id}`).once('value').then(snap => snap.val()))
  );
  return threads.filter(Boolean);
}