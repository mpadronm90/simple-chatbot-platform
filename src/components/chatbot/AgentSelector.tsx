import React from 'react';

interface AgentSelectorProps {
  agents: { id: string; name: string }[];
  onSelect: (id: string) => void;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({ agents, onSelect }) => {
  return (
    <div className="agent-selector">
      <h3>Select an Agent</h3>
      <ul>
        {agents.map(agent => (
          <li key={agent.id} onClick={() => onSelect(agent.id)}>
            {agent.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AgentSelector;
