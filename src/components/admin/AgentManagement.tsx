import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAgents, addAgent, removeAgent } from '../../store/agentsSlice';
import { RootState } from '../../store';

const AgentManagement: React.FC = () => {
  const dispatch = useDispatch();
  const agents = useSelector((state: RootState) => state.agents.agents);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentDescription, setNewAgentDescription] = useState('');
  const [newAgentInstructions, setNewAgentInstructions] = useState('');
  const userId = useSelector((state: RootState) => state.auth.user?.uid);

  useEffect(() => {
    if (userId) {
      dispatch(fetchAgents(userId) as any);
    }
  }, [dispatch, userId]);

  const handleCreateAgent = () => {
    if (newAgentName.trim() && userId) {
      dispatch(addAgent({
        agent: {
          name: newAgentName,
          description: newAgentDescription,
          instructions: newAgentInstructions,
          ownerId: userId
        },
        userId
      }) as any);
      setNewAgentName('');
      setNewAgentDescription('');
      setNewAgentInstructions('');
    }
  };

  const handleDeleteAgent = (id: string) => {
    if (userId) {
      dispatch(removeAgent({ id, userId }) as any);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Agent Management</h2>
      <div className="mb-4 space-y-2">
        <input
          type="text"
          value={newAgentName}
          onChange={(e) => setNewAgentName(e.target.value)}
          placeholder="New Agent Name"
          className="p-2 border rounded w-full"
        />
        <textarea
          value={newAgentDescription}
          onChange={(e) => setNewAgentDescription(e.target.value)}
          placeholder="Agent Description"
          className="p-2 border rounded w-full"
          rows={3}
        />
        <textarea
          value={newAgentInstructions}
          onChange={(e) => setNewAgentInstructions(e.target.value)}
          placeholder="Agent Instructions"
          className="p-2 border rounded w-full"
          rows={5}
        />
        <button
          onClick={handleCreateAgent}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full"
        >
          Create Agent
        </button>
      </div>
      <ul className="space-y-2">
        {agents.map((agent) => (
          <li key={agent.id} className="bg-gray-100 p-4 rounded">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">{agent.name}</h3>
              <button
                onClick={() => handleDeleteAgent(agent.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">{agent.description}</p>
            <p className="text-xs text-gray-500">{agent.instructions}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AgentManagement;
