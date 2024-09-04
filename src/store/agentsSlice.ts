import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { APIAction, callAPI } from '../services/api';

export interface Agent {
  id: string;
  name: string | null;
  description: string;
  instructions: string;
  ownerId: string;
}

interface AgentsState {
  agents: Agent[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AgentsState = {
  agents: [] as Agent[],
  status: 'idle',
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

export const updateAgent = createAsyncThunk(
  'agents/updateAgent',
  async (data: { assistantId: string, name: string, description: string, instructions: string, userId: string }, { rejectWithValue }) => {
    try {
      const response = await callAPI(APIAction.UPDATE_ASSISTANT, data);
      return response;
    } catch (error) {
      return rejectWithValue(error as any);
    }
  }
);

const agentsSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.agents = action.payload;
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(addAgent.fulfilled, (state, action) => {
        state.agents.push(action.payload);
      })
      .addCase(removeAgent.fulfilled, (state, action) => {
        state.agents = state.agents.filter(agent => agent.id !== action.payload);
      })
      .addCase(updateAgent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateAgent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.agents.findIndex(agent => agent.id === action.payload.id);
        if (index !== -1) {
          state.agents[index] = action.payload;
        }
      })
      .addCase(updateAgent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default agentsSlice.reducer;
