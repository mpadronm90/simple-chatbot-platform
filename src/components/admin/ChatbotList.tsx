import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchChatbots, removeChatbotAsync } from '../../store/chatbotsSlice';
import { fetchAgents } from '../../store/agentsSlice';
import { Edit, Trash2, Eye, Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Chatbot } from '../../store/chatbotsSlice';
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Agent } from '../../store/agentsSlice';

const ChatbotCard = ({ chatbot, onRemove, onEdit, agents }: { chatbot: Chatbot, onRemove: (id: string, ownerId: string) => void, onEdit: (chatbot: Chatbot) => void, agents: Agent[] }) => {
  const router = useRouter();
  const agent = agents.find(a => a.id === chatbot.agentId);

  const handleView = () => {
    router.push(`/chatbot/${chatbot.id}`);
  };

  const handleCopyEmbed = () => {
    const embedCode = `
    <script>
      (function() {
        var iframe = document.createElement('iframe');
        iframe.src = '${typeof window !== 'undefined' ? window.location.origin : ''}/chatbot/${chatbot.id}';
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
        <Button variant="outline" size="icon" onClick={handleView}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onEdit(chatbot)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onRemove(chatbot.id, chatbot.ownerId)}>
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleCopyEmbed}>
          <Copy className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

const ChatbotList = ({ onEdit }: { onEdit: (chatbot: Chatbot) => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const chatbots = useSelector((state: RootState) => state.chatbots.chatbots);
  const agents = useSelector((state: RootState) => state.agents.agents);
  const userId = useSelector((state: RootState) => state.auth.user?.uid);

  useEffect(() => {
    if (userId) {
      dispatch(fetchChatbots(userId));
      dispatch(fetchAgents(userId));
    }
  }, [dispatch, userId]);

  const handleRemove = (chatbotId: string) => {
    dispatch(removeChatbotAsync(chatbotId));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {chatbots.map((chatbot) => (
        <ChatbotCard key={chatbot.id} chatbot={chatbot} onRemove={handleRemove} onEdit={onEdit} agents={agents} />
      ))}
    </div>
  );
};

export default ChatbotList;
