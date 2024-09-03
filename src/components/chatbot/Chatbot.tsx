"use client"; // Add this line at the top

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { 
  addMessageToCurrentThread, 
  setCurrentThread, 
  fetchThreads, 
  addMessageToThread, 
  runAssistantWithStream,
  Message 
} from '../../store/threadsSlice';
import MessageList from '../chatbot/MessageList';
import MessageInput from '../chatbot/MessageInput';
import ThreadSelector from '../chatbot/ThreadSelector';

interface ChatbotProps {
  chatbotId: string;
  userId: string;
  adminId: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ chatbotId, userId, adminId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentThread = useSelector((state: RootState) => state.threads.currentThread);
  const chatbot = useSelector((state: RootState) => 
    state.chatbots.chatbots.find(bot => bot.id === chatbotId)
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchThreads({ userId, chatbotId, adminId }));
  }, [dispatch, userId, chatbotId, adminId]);

  useEffect(() => {
    if (currentThread) {
      dispatch(setCurrentThread(currentThread));
    }
  }, [currentThread, dispatch]);

  const handleSendMessage = async (content: string) => {
    if (!currentThread || !chatbot) return;

    setIsLoading(true);
    try {
      const userMessage: Message = {
        id: `${Date.now()}`,
        object: 'message',
        created: Date.now(),
        role: 'user',
        content: content,
        content_type: 'text'
      };
      
      await dispatch(addMessageToThread({
        threadId: currentThread.id,
        content: content,
        userId: userId
      }));

      const botMessage: Message = {
        id: `${Date.now() + 1}`,
        object: 'message',
        created: Date.now() + 1,
        role: 'assistant',
        content: '',
        content_type: 'text'
      };
      dispatch(addMessageToCurrentThread(botMessage));

      // Run the assistant with streaming
      await dispatch(runAssistantWithStream({
        threadId: currentThread.id,
        assistantId: chatbot.agentId,
        userId: userId
      }));
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const chatbotStyles = chatbot?.styles || {};

  return (
    <div className="chat-interface" style={chatbotStyles}>
      {chatbot ? (
        <>
          <ThreadSelector chatbotId={chatbotId} userId={userId} adminId={adminId} />
          {currentThread && <MessageList messages={currentThread.messages} threadId={currentThread.id} userId={userId} />}
          {currentThread && <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} threadId={currentThread.id} userId={userId} />}
        </>
      ) : (
        <p>Chatbot does not exist</p>
      )}
    </div>
  );
};

export default Chatbot;
