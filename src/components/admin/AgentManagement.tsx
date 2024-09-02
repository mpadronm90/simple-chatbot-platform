import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const AgentManagement: React.FC = () => {
  const agents = useSelector((state: RootState) => state.agents.agents);

  return (
    <div>
      <h2>Agent Management</h2>
      <ul>
        {agents.map((agent) => (
          <li key={agent.id}>{agent.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default AgentManagement;
