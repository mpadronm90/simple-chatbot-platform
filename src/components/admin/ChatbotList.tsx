import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchChatbots, removeChatbotAsync, addChatbotAsync } from '../../store/chatbotsSlice';
import { fetchAgents } from '../../store/agentsSlice';
import { Edit, Trash2, Copy, Plus, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Chatbot, Agent } from '../../shared/api.types';
import { Label } from "@/components/ui/label";
import { toast } from 'react-hot-toast';
import EditChatbotForm from './EditChatbotForm';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ChatbotCard = ({ chatbot, onRemove, onEdit, agents }: { chatbot: Chatbot, onRemove: (id: string, ownerId: string) => void, onEdit: (chatbot: Chatbot) => void, agents: Agent[] }) => {
  const agent = agents.find(a => a.id === chatbot.agentId);

  const handleCopyEmbed = () => {
    const embedCode = `
    <script>
      (function() {
        var iframe = document.createElement('iframe');
        iframe.src = '${typeof window !== 'undefined' ? window.location.origin : ''}/chatbot?id=${chatbot.id}';
        iframe.style.position = 'fixed';
        iframe.style.bottom = '20px';
        iframe.style.right = '20px';
        iframe.style.width = '64px';
        iframe.style.height = '64px';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '50%';
        iframe.style.zIndex = '10000';
        iframe.style.transition = 'all 0.3s ease';
        document.body.appendChild(iframe);

        window.addEventListener('message', function(event) {
          if (event.data.type === 'CHATBOT_RESIZE') {
            iframe.style.width = event.data.width;
            iframe.style.height = event.data.height;
            iframe.style.borderRadius = event.data.borderRadius;
          }
        }, false);
      })();
    </script>`;

    navigator.clipboard.writeText(embedCode).then(() => {
      toast.success('Embed code copied to clipboard', {
        duration: 3000,
        icon: '📋',
      });
    }).catch(() => {
      toast.error('Failed to copy embed code', {
        duration: 3000,
        icon: '❌',
      });
    });
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold truncate">{chatbot.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
          <Label className="text-sm font-semibold">Agent</Label>
          <p className="text-sm text-gray-700">{agent ? agent.name : 'Unknown Agent'}</p>
        </div>
        <div>
          <Label className="text-sm font-semibold">Description</Label>
          <p className="text-sm text-gray-700 line-clamp-2">{chatbot.description}</p>
        </div>
        <div>
          <Label className="text-sm font-semibold">Appearance</Label>
          <p className="text-sm text-gray-700">Color: {chatbot.appearance.color}</p>
          <p className="text-sm text-gray-700">Font: {chatbot.appearance.font}</p>
          <p className="text-sm text-gray-700">Size: {chatbot.appearance.size}px</p>
        </div>
      </CardContent>
      <CardFooter className="justify-end space-x-2">
      <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleCopyEmbed}>
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy Embed Code</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => onEdit(chatbot)}>
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Chatbot</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => onRemove(chatbot.id, chatbot.ownerId)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete Chatbot</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

const ChatbotList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const chatbots = useSelector((state: RootState) => state.chatbots.chatbots);
  const agents = useSelector((state: RootState) => state.agents.agents);
  const userId = useSelector((state: RootState) => state.auth.user?.uid);
  const [editingChatbot, setEditingChatbot] = useState<Chatbot | null>(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchChatbots(userId));
      dispatch(fetchAgents(userId));
    }
  }, [dispatch, userId]);

  const handleRemove = (chatbotId: string) => {
    dispatch(removeChatbotAsync(chatbotId));
  };

  const handleEdit = (chatbot: Chatbot) => {
    setEditingChatbot(chatbot);
  };

  const handleCreateChatbot = () => {
    if (agents.length === 0) {
      toast.error('Please create an agent first.');
      return;
    }

    const defaultChatbot: Omit<Chatbot, 'id'> = {
      name: 'New Chatbot',
      agentId: agents[0].id,
      description: '',
      appearance: { color: '#000000', font: 'arial', size: '16' },
      ownerId: userId!
    };

    dispatch(addChatbotAsync(defaultChatbot))
      .then((action) => {
        if (addChatbotAsync.fulfilled.match(action)) {
          setEditingChatbot(action.payload);
        }
      })
      .catch((error) => {
        toast.error('Failed to create chatbot: ' + error.message);
      });
  };

  const handleCloseEdit = () => {
    setEditingChatbot(null);
    // Refresh the chatbots list
    if (userId) {
      dispatch(fetchChatbots(userId));
    }
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Chatbots</h2>
        <div className="flex justify-between items-center mb-4">
          <div>
            {editingChatbot ? (
              <Button variant="outline" onClick={handleCloseEdit}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
              </Button>
            ) : (
              <p className="text-gray-600">Manage your chatbots</p>
            )}
          </div>
          <Button onClick={handleCreateChatbot}>
            <Plus className="mr-2 h-4 w-4" /> Create New Chatbot
          </Button>
        </div>
      </div>

      {editingChatbot ? (
        <EditChatbotForm 
          key={editingChatbot.id} 
          chatbot={editingChatbot} 
          onClose={handleCloseEdit} 
          onUpdate={(updatedChatbot) => setEditingChatbot(updatedChatbot)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chatbots.map((chatbot) => (
            <ChatbotCard 
              key={chatbot.id} 
              chatbot={chatbot} 
              onRemove={handleRemove} 
              onEdit={handleEdit} 
              agents={agents} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatbotList;
