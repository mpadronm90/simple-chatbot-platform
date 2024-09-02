'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ChatInterface from '../../../components/user/ChatInterface';

const ChatbotPage: React.FC = () => {
  const params = useParams();
  const chatbotId = params.id as string;

  return <ChatInterface chatbotId={chatbotId} userId="user-id" />;
};

export default ChatbotPage;
