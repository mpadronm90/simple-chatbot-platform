'use client';

import React, { Suspense } from 'react';
import ChatbotContent from '@/components/chatbot/ChatbotContent';
import { Loading } from '@/components/ui/loading';

const ChatbotPage: React.FC = () => {
  return (
    <div className="w-full h-full flex items-end justify-end">
      <Suspense fallback={<Loading />}>
        <ChatbotContent />
      </Suspense>
    </div>
  );
};

export default ChatbotPage;