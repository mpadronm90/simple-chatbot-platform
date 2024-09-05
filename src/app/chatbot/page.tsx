'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Chatbot from '../../components/chatbot/Chatbot';

const ChatbotPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatbotId, setChatbotId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('id');
    setChatbotId(id);
  }, [searchParams]);

  if (!chatbotId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full flex items-end justify-end">
      <Chatbot chatbotId={chatbotId} isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default ChatbotPage;