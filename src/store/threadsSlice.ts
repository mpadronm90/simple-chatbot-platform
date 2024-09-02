import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
}

interface Thread {
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
  },
});

export const {
  setThreads,
  addThread,
  updateThread,
  removeThread,
  setCurrentThread,
  addMessageToCurrentThread,
} = threadsSlice.actions;
export default threadsSlice.reducer;
