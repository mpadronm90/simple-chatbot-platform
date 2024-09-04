'use client';

import React, { useState } from 'react';
import Chatbot from '../../../components/chatbot/Chatbot';

const ChatbotPage: React.FC<{ params: { id: string } }> = ({ params }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full h-full flex items-end justify-end">
      <Chatbot chatbotId={params.id} isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default ChatbotPage;