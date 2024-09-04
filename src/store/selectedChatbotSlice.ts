import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Chatbot } from './chatbotsSlice';
import { ref, get } from 'firebase/database';
import { realtimeDb } from '../services/firebase'; // Assuming you have a firebase.ts file with db export

const getChatbotById = async (chatbotId: string): Promise<Chatbot | null> => {
  try {
    const chatbotRef = ref(realtimeDb, `chatbots/${chatbotId}`);
    const snapshot = await get(chatbotRef);
    if (snapshot.exists()) {
      return { id: chatbotId, ...snapshot.val() } as Chatbot;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching chatbot:', error);
    throw error;
  }
};

interface SelectedChatbotState {
  chatbot: Chatbot | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SelectedChatbotState = {
  chatbot: null,
  status: 'idle',
  error: null,
};

export const fetchSelectedChatbot = createAsyncThunk(
  'selectedChatbot/fetchSelectedChatbot',
  async (chatbotId: string) => {
    const chatbot = await getChatbotById(chatbotId);
    if (!chatbot) {
      throw new Error('Chatbot not found');
    }
    return chatbot;
  }
);

const selectedChatbotSlice = createSlice({
  name: 'selectedChatbot',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSelectedChatbot.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSelectedChatbot.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.chatbot = action.payload;
      })
      .addCase(fetchSelectedChatbot.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default selectedChatbotSlice.reducer;
