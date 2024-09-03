import React, { useState } from 'react';
import { Package2, MessageSquare, Users, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ChatbotList from './ChatbotList';
import AgentList from './AgentList';
import ChatbotForm from './ChatbotForm';
import AgentForm from './AgentForm';

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => (
  <aside className="w-64 bg-white h-screen border-r">
    <div className="p-4">
      <nav className="space-y-2">
        <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('dashboard')}>
          <Package2 className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('chatbots')}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Chatbots
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('agents')}>
          <Users className="mr-2 h-4 w-4" />
          Agents
        </Button>
      </nav>
    </div>
  </aside>
);

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showChatbotForm, setShowChatbotForm] = useState(false);
  const [showAgentForm, setShowAgentForm] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8 overflow-auto">
        {activeTab === 'chatbots' && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Chatbots</h2>
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">Manage your chatbots</p>
              <Button onClick={() => setShowChatbotForm(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create New Chatbot
              </Button>
            </div>
            {showChatbotForm ? (
              <ChatbotForm onClose={() => setShowChatbotForm(false)} />
            ) : (
              <ChatbotList />
            )}
          </div>
        )}
        {activeTab === 'agents' && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Agents</h2>
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">Manage your AI agents</p>
              <Button onClick={() => setShowAgentForm(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create New Agent
              </Button>
            </div>
            {showAgentForm ? (
              <AgentForm onClose={() => setShowAgentForm(false)} />
            ) : (
              <AgentList />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
