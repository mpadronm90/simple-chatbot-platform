import React from 'react';
import ChatbotList from './ChatbotList';
import AgentManagement from './AgentManagement';

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ChatbotList />
      <AgentManagement />
    </div>
  );
};

export default AdminDashboard;
