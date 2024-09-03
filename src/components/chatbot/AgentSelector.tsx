import React from 'react';

interface AgentSelectorProps {
  agents?: { id: string; name: string }[];
  onSelect: (id: string) => void;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({ agents = [], onSelect }) => {
  return (
    <div className="agent-selector">
      <h3>Select an Agent</h3>
      {agents.length > 0 ? (
        <ul>
          {agents.map(agent => (
            <li key={agent.id} onClick={() => onSelect(agent.id)}>
              {agent.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No agents available</p>
      )}
    </div>
  );
};

export default AgentSelector;
