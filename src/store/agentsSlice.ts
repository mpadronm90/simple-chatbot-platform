import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { callAPI, APIAction } from '../services/api';

export interface Agent {
  id: string;
  name: string | null;
  description: string;
  instructions: string;
  ownerId: string;
}

interface AgentsState {
  agents: Agent[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AgentsState = {
  agents: [] as Agent[],
  loading: 'idle',
  error: null,
};

export const fetchAgents = createAsyncThunk('agents/fetchAgents', async (userId: string) => {
  return await callAPI(APIAction.GET_AGENTS, { userId });
});

export const addAgent = createAsyncThunk('agents/addAgent', async ({ agent, userId }: { agent: Omit<Agent, 'id'>, userId: string }) => {
  return await callAPI(APIAction.CREATE_ASSISTANT, {
    name: agent.name ?? '',
    description: agent.description,
    instructions: agent.instructions,
    userId,
  });
});

export const removeAgent = createAsyncThunk('agents/removeAgent', async ({ id, userId }: { id: string, userId: string }) => {
  await callAPI(APIAction.DELETE_ASSISTANT, { assistantId: id, userId });
  return id;
});

const agentsSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgents.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.agents = action.payload;
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(addAgent.fulfilled, (state, action) => {
        state.agents.push(action.payload);
      })
      .addCase(removeAgent.fulfilled, (state, action) => {
        state.agents = state.agents.filter(agent => agent.id !== action.payload);
      });
  },
});

export default agentsSlice.reducer;
