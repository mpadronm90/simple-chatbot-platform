import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { callAPI } from '../services/api';
import { APIAction, Thread, Message } from '../shared/api.types';

interface ThreadsState {
  threads: Thread[];
  currentThread: Thread | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ThreadsState = {
  threads: [],
  currentThread: null,
  status: 'idle',
  error: null,
};

export const fetchThreads = createAsyncThunk(
  'threads/fetchThreads',
  async ({ userId, chatbotId }: { userId: string; chatbotId: string; }) => {
    return await callAPI(APIAction.GET_THREADS, { userId, chatbotId });
  }
);

export const createThread = createAsyncThunk(
  'threads/createThread',
  async ({ userId, chatbotId }: { userId: string; chatbotId: string }) => {
    return await callAPI(APIAction.CREATE_THREAD, { userId, chatbotId });
  }
);

export const addMessageToThread = createAsyncThunk(
  'threads/addMessageToThread',
  async ({ threadId, content }: { threadId: string; content: string; }) => {
    return await callAPI(APIAction.ADD_MESSAGE, { threadId, content });
  }
);

export const runAssistantWithStream = createAsyncThunk(
  'threads/runAssistantWithStream',
  async ({ threadId, assistantId, userId }: { threadId: string; assistantId: string; userId: string }) => {
    await callAPI(APIAction.RUN_ASSISTANT, { threadId, assistantId, userId });
    return { threadId };
  }
);

// Add this new async thunk
export const fetchThreadMessages = createAsyncThunk(
  'threads/fetchThreadMessages',
  async ({ threadId }: { threadId: string }) => {
    const messages = await callAPI(APIAction.GET_THREAD_MESSAGES, { threadId });
    return { threadId, messages };
  }
);

export const fetchAndSetThreads = createAsyncThunk(
  'threads/fetchAndSetThreads',
  async ({ userId, chatbotId }: { userId: string; chatbotId: string }, { getState }) => {
    const state = getState() as { threads: ThreadsState };
    if (state.threads.threads.length === 0) {
      const fetchedThreads = await callAPI(APIAction.GET_THREADS, { userId, chatbotId });
      if (fetchedThreads.length > 0) {
        return fetchedThreads;
      } else {
        const newThread = await callAPI(APIAction.CREATE_THREAD, { userId, chatbotId });
        return [newThread];
      }
    }
    return state.threads.threads;
  }
);

export const runAssistant = createAsyncThunk(
  'threads/runAssistant',
  async ({ threadId, assistantId, userId }: { threadId: string; assistantId: string; userId: string }) => {
    const response = await callAPI(APIAction.RUN_ASSISTANT, { threadId, assistantId, userId });
    return response.message;
  }
);

const threadsSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {
    setThreads: (state, action: PayloadAction<Thread[]>) => {
      state.threads = action.payload;
    },
    addThread: (state, action: PayloadAction<Thread>) => {
      state.threads.push(action.payload);
    },
    updateThread: (state, action: PayloadAction<Thread>) => {
      const index = state.threads.findIndex((thread: Thread) => thread.id === action.payload.id);
      if (index !== -1) {
        state.threads[index] = action.payload;
      }
    },
    removeThread: (state, action: PayloadAction<string>) => {
      state.threads = state.threads.filter((thread: Thread) => thread.id !== action.payload);
    },
    setCurrentThread: (state, action: PayloadAction<Thread | null>) => {
      state.currentThread = action.payload;
    },
    addMessageToCurrentThread: (state, action: PayloadAction<{ messageId: string; message: Message }>) => {
      if (state.currentThread) {
        state.currentThread.messages = {
          ...state.currentThread.messages,
          [action.payload.messageId]: action.payload.message
        };
      }
    },
    updateAssistantMessage: (state, action: PayloadAction<{ threadId: string; messageId: string; content: string }>) => {
      const { threadId, messageId, content } = action.payload;
      const thread = state.threads.find((t: Thread) => t.id === threadId);
      if (thread && thread.messages[messageId]) {
        thread.messages[messageId].content = content;
      }
      if (state.currentThread && state.currentThread.id === threadId && state.currentThread.messages[messageId]) {
        state.currentThread.messages[messageId].content = content;
      }
    },
    updateThreadMessages: (state, action: PayloadAction<{ threadId: string; messages: { [key: string]: Message } }>) => {
      const { threadId, messages } = action.payload;
      const thread = state.threads.find((t: Thread) => t.id === threadId);
      if (thread) {
        thread.messages = messages;
      }
      if (state.currentThread && state.currentThread.id === threadId) {
        state.currentThread.messages = messages;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.threads = action.payload as unknown as Thread[];
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.threads.push(action.payload as unknown as Thread);
        state.currentThread = action.payload as unknown as Thread;
      })
      .addCase(addMessageToThread.fulfilled, (state, action) => {
        const { threadId, id, content, role, created, content_type } = action.payload;
        const newMessage: Message = {
          id,
          threadId,
          role,
          content,
          content_type,
          created
        };
        if (state.currentThread && state.currentThread.id === threadId) {
          state.currentThread.messages = {
            ...state.currentThread.messages,
            [id]: newMessage
          };
        }
        const thread = state.threads.find((t: Thread) => t.id === threadId);
        if (thread) {
          thread.messages = {
            ...thread.messages,
            [id]: newMessage
          };
        }
      })
      .addCase(runAssistantWithStream.fulfilled, (state, action) => {
        // The streaming is complete, you can perform any necessary cleanup or state updates here
      })
      .addCase(fetchThreadMessages.fulfilled, (state, action) => {
        const { threadId, messages } = action.payload;
        const thread = state.threads.find((t: Thread) => t.id === threadId);
        const messagesObject = Array.isArray(messages)
          ? Object.fromEntries(messages.map((msg: Message) => [msg.id, msg]))
          : {};
        if (thread) {
          thread.messages = messagesObject;
        }
        if (state.currentThread && state.currentThread.id === threadId) {
          state.currentThread.messages = messagesObject;
        }
      })
      .addCase(fetchAndSetThreads.fulfilled, (state, action) => {
        state.threads = action.payload;
        state.currentThread = action.payload[0];
      })
      .addCase(runAssistant.fulfilled, (state, action) => {
        const message = action.payload;
        if (state.currentThread && state.currentThread.id === message.threadId) {
          state.currentThread.messages[message.id] = message;
        }
        const thread = state.threads.find(t => t.id === message.threadId);
        if (thread) {
          thread.messages[message.id] = message;
        }
      });
  },
});

export const { 
  setThreads, 
  addThread, 
  updateThread, 
  removeThread, 
  setCurrentThread, 
  addMessageToCurrentThread,
  updateAssistantMessage,
  updateThreadMessages 
} = threadsSlice.actions;

export default threadsSlice.reducer;
