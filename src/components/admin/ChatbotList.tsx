import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const ChatbotList: React.FC = () => {
  const chatbots = useSelector((state: RootState) => state.chatbots.chatbots);

  return (
    <div>
      {chatbots.map((chatbot) => (
        <div key={chatbot.id}>{chatbot.name}</div>
      ))}
    </div>
  );
};

export default ChatbotList;
