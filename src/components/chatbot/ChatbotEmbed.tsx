import React, { useState, useEffect } from 'react';
import Chatbot from './Chatbot';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { Button } from "@/components/ui/button";
import { fetchSelectedChatbot } from '../../store/selectedChatbotSlice';

interface ChatbotEmbedProps {
  chatbotId: string;
}

const ChatbotEmbed: React.FC<ChatbotEmbedProps> = ({ chatbotId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { chatbot, status, error } = useSelector((state: RootState) => state.selectedChatbot);
  const userId = useSelector((state: RootState) => state.auth.user?.uid);

  useEffect(() => {
    dispatch(fetchSelectedChatbot(chatbotId));
  }, [dispatch, chatbotId]);

  if (status === 'loading') {
    return <div>Loading chatbot...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  if (!chatbot) {
    return <div>Chatbot not found</div>;
  }

  if (!userId) {
    return <div>User must be logged in</div>;
  }

  return (
    <div className="fixed bottom-8 right-4">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg w-[350px]">
          <Chatbot chatbotId={chatbotId} userId={userId} adminId={chatbot.ownerId} />
          <Button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
        </div>
      ) : (
        <Button
          className="bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600"
          onClick={() => setIsOpen(true)}
        >
          Chat with us
        </Button>
      )}
    </div>
  );
};

export default ChatbotEmbed;