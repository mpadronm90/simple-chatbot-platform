import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import agentsReducer from './agentsSlice';
import chatbotsReducer from './chatbotsSlice';
import threadsReducer from './threadsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    agents: agentsReducer,
    chatbots: chatbotsReducer,
    threads: threadsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
