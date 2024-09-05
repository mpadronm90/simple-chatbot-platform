import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import chatbotsReducer from './chatbotsSlice';
import authReducer from './authSlice';
import agentsReducer from './agentsSlice';
import threadsReducer from './threadsSlice';
import selectedChatbotReducer from './selectedChatbotSlice';

/**
 * Configures and creates the Redux store with all reducers.
 */
export const store = configureStore({
  reducer: {
    chatbots: chatbotsReducer,
    auth: authReducer,
    agents: agentsReducer,
    threads: threadsReducer,
    selectedChatbot: selectedChatbotReducer,
  },
});

/**
 * Inferred type of the entire state tree.
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Inferred type of the dispatch function.
 */
export type AppDispatch = typeof store.dispatch;

/**
 * Type definition for Redux thunk actions.
 * @template ReturnType - The return type of the thunk action.
 */
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
