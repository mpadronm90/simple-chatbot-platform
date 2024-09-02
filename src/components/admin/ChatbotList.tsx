import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const ChatbotList: React.FC = () => {
  const chatbots = useSelector((state: RootState) => state.chatbots.chatbots);

  return (
    <div>
      <h2>Chatbot List</h2>
      <ul>
        {chatbots.map((chatbot) => (
          <li key={chatbot.id}>{chatbot.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ChatbotList;
