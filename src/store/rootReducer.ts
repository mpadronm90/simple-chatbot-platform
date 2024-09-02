import { combineReducers } from '@reduxjs/toolkit';
import chatbotsReducer from './chatbotsSlice';
import agentsReducer from './agentsSlice';
import authReducer from './authSlice';
import threadsReducer from './threadsSlice';

const rootReducer = combineReducers({
  chatbots: chatbotsReducer,
  agents: agentsReducer,
  auth: authReducer,
  threads: threadsReducer,
});

export default rootReducer;

// Define the RootState type
export type RootState = ReturnType<typeof rootReducer>;