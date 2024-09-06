import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchAgents, removeAgent, addAgent } from '../../store/agentsSlice';
import { Edit, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Agent } from '../../shared/api.types';
import { Label } from "@/components/ui/label";
import { toast } from 'react-hot-toast';
import EditAgentForm from './EditAgentForm';
import { Loader2 } from 'lucide-react'; // Add this import

const AgentCard: React.FC<{ agent: Agent; onDelete: (id: string) => void; onEdit: (agent: Agent) => void }> = ({ agent, onDelete, onEdit }) => (
  <Card className="flex flex-col h-full">
    <CardHeader>
      <CardTitle className="text-xl font-bold truncate">{agent.name}</CardTitle>
    </CardHeader>
    <CardContent className="flex-grow space-y-4">
      <div>
        <Label className="text-sm font-semibold">Description</Label>
        <p className="text-sm text-gray-700 line-clamp-2">{agent.description}</p>
      </div>
      <div>
        <Label className="text-sm font-semibold">Instructions</Label>
        <p className="text-sm text-gray-700 line-clamp-2">{agent.instructions}</p>
      </div>
    </CardContent>
    <CardFooter className="justify-end space-x-2">
      <Button variant="outline" size="icon" onClick={() => onEdit(agent)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => onDelete(agent.id)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </CardFooter>
  </Card>
);

const AgentList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const agents = useSelector((state: RootState) => state.agents.agents);
  const chatbots = useSelector((state: RootState) => state.chatbots.chatbots);
  const userId = useSelector((state: RootState) => state.auth.user?.uid);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      dispatch(fetchAgents(userId)).finally(() => setIsLoading(false));
    }
  }, [dispatch, userId]);

  const handleDeleteAgent = (id: string) => {
    if (userId) {
      const isConnected = chatbots.some(chatbot => chatbot.agentId === id);
      if (isConnected) {
        toast.error('Cannot delete an agent that is connected to a chatbot.');
      } else {
        dispatch(removeAgent({ id, userId }));
      }
    }
  };

  const handleCreateAgent = () => {
    if (userId) {
      const draftAgent: Omit<Agent, 'id'> = {
        name: '',
        description: '',
        instructions: '',
        model: 'gpt-4-turbo-preview',
        ownerId: userId
      };
      dispatch(addAgent({ agent: draftAgent, userId }))
        .then((action) => {
          if (addAgent.fulfilled.match(action)) {
            setEditingAgent(action.payload);
          }
        })
        .catch((error) => {
          toast.error('Failed to create draft agent: ' + error.message);
        });
    }
  };

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent);
  };

  const handleCloseEdit = () => {
    setEditingAgent(null);
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Agents</h2>
        <div className="flex justify-between items-center mb-4">
          <div>
            {editingAgent ? (
              <Button variant="outline" onClick={handleCloseEdit}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
              </Button>
            ) : (
              <p className="text-gray-600">Manage your AI agents</p>
            )}
          </div>
          {!editingAgent && (
            <Button onClick={handleCreateAgent}>
              <Plus className="mr-2 h-4 w-4" /> Create New Agent
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : editingAgent ? (
        <EditAgentForm 
          agent={editingAgent} 
          onClose={handleCloseEdit} 
          isConnectedToChatbot={chatbots.some(chatbot => chatbot.agentId === editingAgent.id)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} onDelete={handleDeleteAgent} onEdit={handleEditAgent} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentList;
