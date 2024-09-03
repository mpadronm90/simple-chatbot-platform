'use client';

import React from 'react';
import ChatbotEmbed from '../../../components/chatbot/ChatbotEmbed';
import withAuth from '../../../components/auth/withAuth';

const ChatbotPage: React.FC<{ params: { id: string } }> = ({ params }) => {
  return <ChatbotEmbed chatbotId={params.id} />;
};

export default withAuth(ChatbotPage);