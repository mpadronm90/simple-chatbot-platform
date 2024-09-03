import { configureStore } from '@reduxjs/toolkit';
import chatbotsReducer from './chatbotsSlice';
import authReducer from './authSlice';
import agentsReducer from './agentsSlice';
import threadsReducer from './threadsSlice';
import selectedChatbotReducer from './selectedChatbotSlice';

export const store = configureStore({
  reducer: {
    chatbots: chatbotsReducer,
    auth: authReducer,
    agents: agentsReducer,
    threads: threadsReducer,
    selectedChatbot: selectedChatbotReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
