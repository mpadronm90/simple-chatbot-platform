import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const ChatbotList: React.FC = () => {
  const chatbots = useSelector((state: RootState) => state.chatbots.chatbots);

  return (
    <div className="space-y-4">
      {chatbots.map((chatbot) => (
        <div key={chatbot.id} className="bg-gray-100 p-4 rounded-md">
          <h3 className="text-lg font-semibold">{chatbot.name}</h3>
          {/* Add more chatbot details here */}
        </div>
      ))}
    </div>
  );
};

export default ChatbotList;
