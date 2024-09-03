import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { callAPI, APIAction } from '../services/api';

export interface Message {
  id: string;
  object: 'message';
  created: number; // Unix timestamp
  role: 'system' | 'user' | 'assistant';
  content: string;
  content_type: 'text' | 'image' | 'audio' | 'video' | 'file';
  metadata?: Record<string, string>;
}

export interface Thread {
  id: string;
  userId: string;
  chatbotId: string;
  messages: Message[];
}

interface ThreadsState {
  threads: Thread[];
  currentThread: Thread | null;
}

const initialState: ThreadsState = {
  threads: [],
  currentThread: null,
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
  async ({ threadId, content, userId }: { threadId: string; content: string; userId: string }) => {
    return await callAPI(APIAction.ADD_MESSAGE, { threadId, content, userId });
  }
);

export const runAssistantWithStream = createAsyncThunk(
  'threads/runAssistantWithStream',
  async ({ threadId, assistantId, userId }: { threadId: string; assistantId: string; userId: string }, { dispatch }) => {
    const response = await callAPI(APIAction.RUN_ASSISTANT, { threadId, assistantId, userId });
    
    if (response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        accumulatedContent += chunk;

        // Dispatch an action to update the current thread with the accumulated content
        dispatch(updateAssistantMessage({ threadId, content: accumulatedContent }));
      }
    }

    // After streaming is complete, fetch updated messages
    dispatch(fetchThreadMessages({ threadId }));

    return { threadId };
  }
);

// Add this new async thunk
export const fetchThreadMessages = createAsyncThunk(
  'threads/fetchThreadMessages',
  async ({ threadId }: { threadId: string }) => {
    return await callAPI(APIAction.GET_THREAD_MESSAGES, { threadId });
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
      const index = state.threads.findIndex(thread => thread.id === action.payload.id);
      if (index !== -1) {
        state.threads[index] = action.payload;
      }
    },
    removeThread: (state, action: PayloadAction<string>) => {
      state.threads = state.threads.filter(thread => thread.id !== action.payload);
    },
    setCurrentThread: (state, action: PayloadAction<Thread | null>) => {
      state.currentThread = action.payload;
    },
    addMessageToCurrentThread: (state, action: PayloadAction<Message>) => {
      if (state.currentThread) {
        state.currentThread.messages.push(action.payload);
      }
    },
    updateAssistantMessage: (state, action: PayloadAction<{ threadId: string; content: string }>) => {
      const { threadId, content } = action.payload;
      const thread = state.threads.find(t => t.id === threadId);
      if (thread) {
        const lastMessage = thread.messages[thread.messages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          lastMessage.content = content;
        }
      }
      if (state.currentThread && state.currentThread.id === threadId) {
        const lastMessage = state.currentThread.messages[state.currentThread.messages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          lastMessage.content = content;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.threads = action.payload;
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.threads.push(action.payload);
        state.currentThread = action.payload;
      })
      .addCase(addMessageToThread.fulfilled, (state, action) => {
        const thread = state.threads.find(t => t.id === action.payload.threadId);
        if (thread) {
          thread.messages.push(action.payload.message);
        }
        if (state.currentThread && state.currentThread.id === action.payload.threadId) {
          state.currentThread.messages.push(action.payload.message);
        }
      })
      .addCase(runAssistantWithStream.fulfilled, (state, action) => {
        // The streaming is complete, you can perform any necessary cleanup or state updates here
      })
      .addCase(fetchThreadMessages.fulfilled, (state, action) => {
        const thread = state.threads.find(t => t.id === action.payload.threadId);
        if (thread) {
          thread.messages = action.payload.messages;
        }
        if (state.currentThread && state.currentThread.id === action.payload.threadId) {
          state.currentThread.messages = action.payload.messages;
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
  updateAssistantMessage 
} = threadsSlice.actions;

export default threadsSlice.reducer;
