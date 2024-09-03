import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getChatbotById } from '../services/firebase';
import { Chatbot } from './chatbotsSlice';

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
