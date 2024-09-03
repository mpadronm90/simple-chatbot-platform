import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import { APIAction } from '@/services/api';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  
  const firebaseConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  };

  initializeApp({
    ...firebaseConfig,
    credential: applicationDefault(),
  });
}

const db = getDatabase();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const { action, data } = await request.json();

  switch (action) {
    case APIAction.CREATE_ASSISTANT:
      return createAssistant(data);
    case APIAction.GET_AGENTS:
      return getAgents(data);
    case APIAction.DELETE_ASSISTANT:
      return deleteAssistant(data);
    case APIAction.CREATE_THREAD:
      return createThread(data);
    case APIAction.GET_THREADS:
      return getThreadsByUserAndChatbot(data.userId, data.chatbotId, data.adminId);
    case APIAction.ADD_MESSAGE:
      return addMessage(data);
    case APIAction.RUN_ASSISTANT:
      return runAssistantWithStream(data);
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}

async function createAssistant(data: { name: string, description: string, instructions: string, userId: string }) {
  const assistant = await openai.beta.assistants.create({
    name: data.name,
    description: data.description,
    instructions: data.instructions,
    model: "gpt-4-turbo-preview",
  });

  try {
    await db.ref(`agents/${data.userId}/${assistant.id}`).set({
      id: assistant.id,
      name: assistant.name,
      description: assistant.description,
      instructions: assistant.instructions,
      ownerId: data.userId,
    });
    console.log('Assistant saved to database:', assistant.id);
  } catch (error) {
    console.error('Error saving assistant to database:', error);
    // Optionally, you might want to delete the assistant from OpenAI if the database write fails
    await openai.beta.assistants.del(assistant.id);
    throw error;
  }

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

async function addMessage(data: { threadId: string, content: string, userId: string }) {
  const message = await openai.beta.threads.messages.create(data.threadId, {
    role: "user",
    content: data.content,
  });

  await db.ref(`threads/${data.threadId}/messages`).push(message);

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
                controller.enqueue(encoder.encode(content.text.value));
              } else if ('image_file' in content) {
                controller.enqueue(encoder.encode('Image file received'));
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

async function getThreadsByUserAndChatbot(userId: string, chatbotId: string, adminId: string) {
  const userSnapshot = await db.ref(`userThreads/${userId}`).once('value');
  const chatbotSnapshot = await db.ref(`chatbotThreads/${chatbotId}`).once('value');
  const userThreadIds = Object.keys(userSnapshot.val() || {});
  const chatbotThreadIds = new Set(Object.keys(chatbotSnapshot.val() || {}));
  const threadIds = userThreadIds.filter(id => chatbotThreadIds.has(id));
  const threads = await getThreadsByIds(threadIds);
  return threads.filter(thread => thread.adminId === adminId);
}

async function getThreadsByIds(threadIds: string[]) {
  const threads = await Promise.all(
    threadIds.map(id => db.ref(`threads/${id}`).once('value').then(snap => snap.val()))
  );
  return threads.filter(Boolean);
}