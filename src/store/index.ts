import { configureStore } from '@reduxjs/toolkit';
import chatbotsReducer from './chatbotsSlice';
import authReducer from './authSlice';
import agentsReducer from './agentsSlice';
import threadsReducer from './threadsSlice';

export const store = configureStore({
  reducer: {
    chatbots: chatbotsReducer,
    auth: authReducer,
    agents: agentsReducer,
    threads: threadsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
