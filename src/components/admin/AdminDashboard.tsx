import React, { useState } from 'react';
import { Package2, MessageSquare, Users, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ChatbotList from './ChatbotList';
import AgentList from './AgentList';

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

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8 overflow-auto">
        {activeTab === 'chatbots' && <ChatbotList />}
        {activeTab === 'agents' && (
          <AgentList />
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
