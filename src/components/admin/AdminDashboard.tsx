import React from 'react';
import ChatbotList from './ChatbotList';
import AgentManagement from './AgentManagement';

const AdminDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Chatbots</h2>
        <ChatbotList />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Agent Management</h2>
        <AgentManagement />
      </div>
    </div>
  );
};

export default AdminDashboard;
