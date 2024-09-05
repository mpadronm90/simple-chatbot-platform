import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ref, get, set, remove, push } from 'firebase/database';
import { realtimeDb } from '../services/firebase';
import { Chatbot } from '../shared/api.types';

interface ChatbotsState {
  chatbots: Chatbot[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ChatbotsState = {
  chatbots: [],
  status: 'idle',
  error: null,
};

export const fetchChatbots = createAsyncThunk(
  'chatbots/fetchChatbots',
  async (userId: string) => {
    const chatbotsRef = ref(realtimeDb, 'chatbots');
    const snapshot = await get(chatbotsRef);
    return snapshot.val() 
      ? Object.values(snapshot.val() as Record<string, Chatbot>).filter((chatbot) => chatbot.ownerId === userId)
      : [];
  }
);

export const addChatbotAsync = createAsyncThunk(
  'chatbots/addChatbot',
  async (chatbot: Omit<Chatbot, 'id'>) => {
    const newChatbotRef = push(ref(realtimeDb, 'chatbots'));
    const newChatbot = { ...chatbot, id: newChatbotRef.key as string };
    await set(newChatbotRef, newChatbot);
    return newChatbot;
  }
);

export const updateChatbotAsync = createAsyncThunk(
  'chatbots/updateChatbot',
  async (chatbot: Chatbot) => {
    const chatbotRef = ref(realtimeDb, `chatbots/${chatbot.id}`);
    await set(chatbotRef, chatbot);
    return chatbot;
  }
);

export const removeChatbotAsync = createAsyncThunk(
  'chatbots/removeChatbot', 
  async (id: string) => {
    const chatbotRef = ref(realtimeDb, `chatbots/${id}`);
    await remove(chatbotRef);
    return id;
  }
);

const chatbotsSlice = createSlice({
  name: 'chatbots',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatbots.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChatbots.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.chatbots = action.payload as Chatbot[];
      })
      .addCase(fetchChatbots.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(addChatbotAsync.fulfilled, (state, action) => {
        state.chatbots.push(action.payload);
      })
      .addCase(updateChatbotAsync.fulfilled, (state, action) => {
        const index = state.chatbots.findIndex(chatbot => chatbot.id === action.payload.id);
        if (index !== -1) {
          state.chatbots[index] = action.payload;
        }
      })
      .addCase(removeChatbotAsync.fulfilled, (state, action) => {
        state.chatbots = state.chatbots.filter(chatbot => chatbot.id !== action.payload);
      });
  },
});

export default chatbotsSlice.reducer;
