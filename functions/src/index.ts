/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {OpenAI} from "openai";
import {Message, Thread, APIAction, APIInput, APIResponse, Agent} from "./api.types";
import * as dotenv from "dotenv";
dotenv.config();

admin.initializeApp();

const db = admin.database();
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY || functions.config().openai.apikey});

/**
 * Creates a new assistant in OpenAI and saves it to the database.
 * @param {Object} data - Assistant creation data
 * @return {Promise<Assistant>} Created assistant object
 */
async function createAssistantImpl(data: APIInput[APIAction.CREATE_ASSISTANT]): Promise<APIResponse[APIAction.CREATE_ASSISTANT]> {
  console.log("Creating assistant with data:", data);
  const assistant = await openai.beta.assistants.create({
    name: data.name,
    description: data.description,
    instructions: data.instructions,
    model: "gpt-4-turbo-preview",
  });
  console.log("Assistant created in OpenAI:", assistant.id);

  try {
    console.log("Attempting to save assistant to database...");
    const assistantData: Agent = {
      id: assistant.id,
      name: assistant.name || "",
      description: assistant.description || "",
      instructions: assistant.instructions || "",
      model: assistant.model || "",
      ownerId: data.ownerId,
    };
    await db.ref(`agents/${data.ownerId}/${assistant.id}`).set(assistantData);
    console.log("Assistant saved to database:", assistant.id);
  } catch (error) {
    console.error("Error saving assistant to database:", error);
    await openai.beta.assistants.del(assistant.id);
    throw error;
  }

  console.log("Returning response");
  return {
    ...assistant,
    ownerId: data.ownerId,
    description: assistant.description || "",
    name: assistant.name || "",
    instructions: assistant.instructions || "",
  } as Agent;
}

/**
 * Retrieves agents for a given user.
 * @param {Object} data - User data
 * @return {Promise<Assistant[]>} List of agents
 */
async function getAgentsImpl(data: APIInput[APIAction.GET_AGENTS]): Promise<APIResponse[APIAction.GET_AGENTS]> {
  const snapshot = await admin.database().ref(`agents/${data.userId}`).once("value");
  const agents = snapshot.val() || {};
  return Object.values(agents);
}

/**
 * Deletes an assistant from OpenAI and the database.
 * @param {Object} data - Assistant deletion data
 * @return {Promise<{ success: boolean }>} Success status
 */
async function deleteAssistantImpl(data: APIInput[APIAction.DELETE_ASSISTANT]): Promise<APIResponse[APIAction.DELETE_ASSISTANT]> {
  await openai.beta.assistants.del(data.assistantId);
  await db.ref(`agents/${data.userId}/${data.assistantId}`).remove();
  return {success: true};
}

/**
 * Creates a new thread and saves it to the database.
 * @param {Object} data - Thread creation data
 * @return {Promise<Thread>} Created thread data
 */
async function createThreadImpl(data: APIInput[APIAction.CREATE_THREAD]): Promise<APIResponse[APIAction.CREATE_THREAD]> {
  const thread = await openai.beta.threads.create();

  const threadData: Thread = {
    id: thread.id,
    userId: data.userId,
    chatbotId: data.chatbotId,
    createdAt: Date.now(),
    messages: {},
  };

  const updates: Record<string, Thread | boolean> = {
    [`threads/${thread.id}`]: threadData,
    [`userThreads/${data.userId}/${thread.id}`]: true,
    [`chatbotThreads/${data.chatbotId}/${thread.id}`]: true,
  };

  await db.ref().update(updates);

  return threadData;
}

/**
 * Adds a message to a thread.
 * @param {Object} data - Message data
 * @return {Promise<Message>} Added message
 */
async function addMessageImpl(data: APIInput[APIAction.ADD_MESSAGE]): Promise<APIResponse[APIAction.ADD_MESSAGE]> {
  const message = await openai.beta.threads.messages.create(data.threadId, {
    role: "user",
    content: data.content,
  });

  const messageData: Message = {
    id: message.id,
    role: message.role,
    content: data.content,
    created: Date.now(),
    content_type: "text",
    threadId: data.threadId,
  };

  await db.ref(`threads/${data.threadId}/messages`).push(messageData);

  return messageData;
}

/**
 * Updates an existing assistant.
 * @param {Object} data - Assistant update data
 * @return {Promise<Assistant>} Updated assistant data
 */
async function updateAssistantImpl(data: APIInput[APIAction.UPDATE_ASSISTANT]): Promise<APIResponse[APIAction.UPDATE_ASSISTANT]> {
  console.log("Updating assistant with data:", data);
  try {
    const assistant = await openai.beta.assistants.update(data.id, {
      name: data.name,
      description: data.description,
      instructions: data.instructions,
    });
    console.log("Assistant updated in OpenAI:", assistant.id);

    const assistantData = {
      id: assistant.id,
      name: assistant.name || "",
      description: assistant.description || "",
      instructions: assistant.instructions || "",
      model: assistant.model || "",
      ownerId: data.ownerId,
    };

    await db.ref(`agents/${data.ownerId}/${assistant.id}`).update(assistantData);
    console.log("Assistant updated in database");

    return assistantData;
  } catch (error) {
    console.error("Error updating assistant:", error);
    throw error;
  }
}

/**
 * Retrieves threads for a specific user and chatbot.
 * @param {string} userId - User ID
 * @param {string} chatbotId - Chatbot ID
 * @return {Promise<Thread[]>} List of threads
 */
async function getThreadsByUserAndChatbotImpl(userId: string, chatbotId: string): Promise<APIResponse[APIAction.GET_THREADS]> {
  try {
    const userSnapshot = await db.ref(`userThreads/${userId}`).once("value");
    const chatbotSnapshot = await db.ref(`chatbotThreads/${chatbotId}`).once("value");
    const userThreadIds = Object.keys(userSnapshot.val() || {});
    const chatbotThreadIds = new Set(Object.keys(chatbotSnapshot.val() || {}));
    const threadIds = userThreadIds.filter((id) => chatbotThreadIds.has(id));
    const threads = await getThreadsByIdsImpl(threadIds);

    console.log("Filtered threads:", threads);
    return threads;
  } catch (error) {
    console.error("Error in getThreadsByUserAndChatbot:", error);
    throw error;
  }
}

/**
 * Retrieves threads by their IDs.
 * @param {string[]} threadIds - Array of thread IDs
 * @return {Promise<Thread[]>} List of threads
 */
async function getThreadsByIdsImpl(threadIds: string[]): Promise<Thread[]> {
  const threads = await Promise.all(
    threadIds.map((id) => db.ref(`threads/${id}`).once("value").then((snap) => snap.val()))
  );
  return threads.filter(Boolean);
}

/**
 * Retrieves messages for a specific thread.
 * @param {string} threadId - Thread ID
 * @return {Promise<Record<string, Message>>} Object of messages
 */
async function getThreadMessagesImpl(threadId: string): Promise<APIResponse[APIAction.GET_THREAD_MESSAGES]> {
  const snapshot = await db.ref(`threads/${threadId}/messages`).once("value");
  return snapshot.val() || {};
}

/**
 * Runs an assistant and retrieves the response.
 * @param {Object} data - Run data
 * @return {Promise<{ success: boolean, message: Message }>} Assistant's response
 */
async function runAssistantImpl(data: APIInput[APIAction.RUN_ASSISTANT]): Promise<APIResponse[APIAction.RUN_ASSISTANT]> {
  const run = await openai.beta.threads.runs.create(data.threadId, {
    assistant_id: data.assistantId,
  });

  let runStatus = await openai.beta.threads.runs.retrieve(data.threadId, run.id);

  // Add a retry limit to prevent infinite polling
  let retryCount = 0;
  const maxRetries = 30; // Set a max retry limit (e.g., 30 seconds)

  while (runStatus.status !== "completed" && runStatus.status !== "failed" && retryCount < maxRetries) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    runStatus = await openai.beta.threads.runs.retrieve(data.threadId, run.id);
    retryCount++;
  }

  if (retryCount === maxRetries) {
    throw new Error("Run timed out");
  }

  if (runStatus.status === "failed") {
    throw new Error("Run failed");
  }

  const messages = await openai.beta.threads.messages.list(data.threadId);
  const latestMessage = messages.data[0];

  const textContent = latestMessage.content.find((c) => c.type === "text");
  if (textContent && "text" in textContent) {
    const messageData: Message = {
      id: latestMessage.id,
      role: latestMessage.role,
      content: textContent.text.value,
      created: Date.now(),
      content_type: "text",
      threadId: data.threadId,
    };

    // Use push() to generate a new key for the message
    const newMessageRef = db.ref(`threads/${data.threadId}/messages`).push();
    await newMessageRef.set(messageData);

    return {success: true, message: messageData};
  } else {
    throw new Error("No text content found in assistant message");
  }
}


export const createAssistant = functions.https.onCall(async (data: APIInput[APIAction.CREATE_ASSISTANT], context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }
  return await createAssistantImpl(data);
});

export const getAgents = functions.https.onCall(async (data: APIInput[APIAction.GET_AGENTS], context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }
  return await getAgentsImpl(data);
});

export const deleteAssistant = functions.https.onCall(async (data: APIInput[APIAction.DELETE_ASSISTANT], context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }
  return await deleteAssistantImpl(data);
});

export const createThread = functions.https.onCall(async (data: APIInput[APIAction.CREATE_THREAD], context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }
  return await createThreadImpl(data);
});

export const getThreads = functions.https.onCall(async (data: APIInput[APIAction.GET_THREADS], context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }
  return await getThreadsByUserAndChatbotImpl(data.userId, data.chatbotId);
});

export const addMessage = functions.https.onCall(async (data: APIInput[APIAction.ADD_MESSAGE], context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }
  return await addMessageImpl(data);
});

export const runAssistant = functions.https.onCall(async (data: APIInput[APIAction.RUN_ASSISTANT], context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }
  return await runAssistantImpl(data);
});

export const updateAssistant = functions.https.onCall(async (data: APIInput[APIAction.UPDATE_ASSISTANT], context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }
  return await updateAssistantImpl(data);
});

export const getThreadMessages = functions.https.onCall(async (data: APIInput[APIAction.GET_THREAD_MESSAGES], context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }
  return await getThreadMessagesImpl(data.threadId);
});
