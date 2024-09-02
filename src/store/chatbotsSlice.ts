import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Chatbot {
  id: string;
  name: string;
  agentId: string;
  prompt: string;
  appearance: {
    color: string;
    font: string;
    size: string;
  };
}

interface ChatbotsState {
  chatbots: Chatbot[];
}

const initialState: ChatbotsState = {
  chatbots: [],
};

const chatbotsSlice = createSlice({
  name: 'chatbots',
  initialState,
  reducers: {
    setChatbots: (state, action: PayloadAction<Chatbot[]>) => {
      state.chatbots = action.payload;
    },
    addChatbot: (state, action: PayloadAction<Chatbot>) => {
      state.chatbots.push(action.payload);
    },
    updateChatbot: (state, action: PayloadAction<Chatbot>) => {
      const index = state.chatbots.findIndex(chatbot => chatbot.id === action.payload.id);
      if (index !== -1) {
        state.chatbots[index] = action.payload;
      }
    },
    removeChatbot: (state, action: PayloadAction<string>) => {
      state.chatbots = state.chatbots.filter(chatbot => chatbot.id !== action.payload);
    },
  },
});

export const { setChatbots, addChatbot, updateChatbot, removeChatbot } = chatbotsSlice.actions;
export default chatbotsSlice.reducer;
