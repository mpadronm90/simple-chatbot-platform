import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { addChatbotToFirebase, removeChatbotFromFirebase, updateChatbotInFirebase, getChatbotsFromFirebase } from '../services/firebase';

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

export const fetchChatbots = createAsyncThunk('chatbots/fetchChatbots', async (userId: string) => {
  const chatbots = await getChatbotsFromFirebase(userId);
  return chatbots;
});

export const addChatbotAsync = createAsyncThunk('chatbots/addChatbot', async (chatbot: Chatbot) => {
  await addChatbotToFirebase(chatbot);
  return chatbot;
});

export const updateChatbotAsync = createAsyncThunk('chatbots/updateChatbot', async (chatbot: Chatbot) => {
  await updateChatbotInFirebase(chatbot);
  return chatbot;
});

export const removeChatbotAsync = createAsyncThunk(
  'chatbots/removeChatbot', 
  async ({ id }: { id: string}) => {
    await removeChatbotFromFirebase(id);
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
        state.chatbots = action.payload;
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
