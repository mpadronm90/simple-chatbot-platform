import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchChatbots, removeChatbotAsync } from '../../store/chatbotsSlice';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const ChatbotCard = ({ chatbot, onRemove }: { chatbot: Chatbot, onRemove: (id: string) => void }) => (
  <Card>
    <CardHeader>
      <CardTitle>{chatbot.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-500">Agent ID: {chatbot.agentId}</p>
      <p className="text-sm text-gray-500">Prompt: {chatbot.prompt}</p>
    </CardContent>
    <CardFooter className="justify-end space-x-2">
      <Button variant="outline" size="icon">
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => onRemove(chatbot.id, chatbot.ownerId)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </CardFooter>
  </Card>
);

const ChatbotList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const chatbots = useSelector((state: RootState) => state.chatbots.chatbots);
  const userId = useSelector((state: RootState) => state.auth.user?.uid);

  useEffect(() => {
    if (userId) {
      dispatch(fetchChatbots(userId));
    }
  }, [dispatch, userId]);

  const handleRemove = (chatbotId: string, ownerId: string) => {
    dispatch(removeChatbotAsync({ id: chatbotId, ownerId }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {chatbots.map((chatbot) => (
        <ChatbotCard key={chatbot.id} chatbot={chatbot} onRemove={handleRemove} />
      ))}
    </div>
  );
};

export default ChatbotList;
