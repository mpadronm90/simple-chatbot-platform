'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loading } from '@/components/ui/loading';
import Chatbot from './Chatbot';

const ChatbotContent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatbotId, setChatbotId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('id');
    setChatbotId(id);
  }, [searchParams]);

  if (!chatbotId) {
    return <Loading />;
  }

  return <Chatbot chatbotId={chatbotId} isOpen={isOpen} setIsOpen={setIsOpen} />;
};

export default ChatbotContent;
