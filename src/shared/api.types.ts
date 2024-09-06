/* eslint-disable max-len */
export enum APIAction {
  CREATE_ASSISTANT = "CREATE_ASSISTANT",
  GET_AGENTS = "GET_AGENTS",
  DELETE_ASSISTANT = "DELETE_ASSISTANT",
  CREATE_THREAD = "CREATE_THREAD",
  GET_THREADS = "GET_THREADS",
  ADD_MESSAGE = "ADD_MESSAGE",
  RUN_ASSISTANT = "RUN_ASSISTANT",
  GET_THREAD_MESSAGES = "GET_THREAD_MESSAGES",
  UPDATE_ASSISTANT = "UPDATE_ASSISTANT",
}

export interface Message {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  content_type: "text" | "image" | "audio" | "video" | "file";
  created: number;
  threadId: string;
  metadata?: Record<string, string>;
}

export interface Thread {
  id: string;
  userId: string;
  chatbotId: string;
  messages: { [key: string]: Message };
  createdAt: number;
}

export interface Agent {
  id: string;
  name: string | null;
  description: string;
  instructions: string;
  model: string;
  ownerId: string;
}

export interface APIInput {
  [APIAction.CREATE_ASSISTANT]: Omit<Agent, "id">;
  [APIAction.GET_AGENTS]: { userId: string };
  [APIAction.DELETE_ASSISTANT]: { assistantId: string, userId: string };
  [APIAction.CREATE_THREAD]: { userId: string, chatbotId: string };
  [APIAction.GET_THREADS]: { userId: string, chatbotId: string };
  [APIAction.ADD_MESSAGE]: { threadId: string, content: string };
  [APIAction.RUN_ASSISTANT]: { threadId: string; assistantId: string; userId: string };
  [APIAction.GET_THREAD_MESSAGES]: { threadId: string };
  [APIAction.UPDATE_ASSISTANT]: Agent;
}

export interface APIResponse {
  [APIAction.CREATE_ASSISTANT]: Agent;
  [APIAction.GET_AGENTS]: Agent[];
  [APIAction.DELETE_ASSISTANT]: { success: boolean };
  [APIAction.CREATE_THREAD]: Thread;
  [APIAction.GET_THREADS]: Thread[];
  [APIAction.ADD_MESSAGE]: Message;
  [APIAction.RUN_ASSISTANT]: { success: boolean };
  [APIAction.GET_THREAD_MESSAGES]: { [key: string]: Message };
  [APIAction.UPDATE_ASSISTANT]: Agent;
}

export interface Chatbot {
  id: string;
  name: string;
  agentId: string;
  description: string;
  appearance: {
    color: string;
    font: string;
    size: string;
  };
  ownerId: string;
}
