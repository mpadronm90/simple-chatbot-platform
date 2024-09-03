"use client"; // Add this line at the top

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { addMessageToCurrentThread, setCurrentThread, Message, Thread } from '../../store/threadsSlice';
import MessageList from '../chatbot/MessageList';
import MessageInput from '../chatbot/MessageInput';
import ThreadSelector from '../chatbot/ThreadSelector';
import { addMessage, runAssistantWithStream, runAssistantWithoutStream } from '../../services/openai';
import { ref, onValue, push, set } from 'firebase/database';
import { realtimeDb } from '../../services/firebase';

interface ChatInterfaceProps {
  chatbotId: string;
  userId: string;
  adminId: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatbotId, userId, adminId }) => {
  const dispatch = useDispatch();
  const currentThread = useSelector((state: RootState) => state.threads.currentThread);
  const chatbot = useSelector((state: RootState) => 
    state.chatbots.chatbots.find(bot => bot.id === chatbotId)
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentThread) {
      const messagesRef = ref(realtimeDb, `threads/${currentThread.id}/messages`);
      onValue(messagesRef, (snapshot) => {
        const messages: Message[] = [];
        snapshot.forEach((childSnapshot) => {
          const message = childSnapshot.val();
          messages.push(message);
        });
        dispatch(setCurrentThread({ ...currentThread, messages }));
      });
    }
  }, [currentThread, dispatch]);

  const handleSendMessage = async (content: string) => {
    if (!currentThread || !chatbot) return;

    setIsLoading(true);
    try {
      const message: Message = {
        id: `${Date.now()}`,
        object: 'message',
        created: Date.now(),
        role: 'user',
        content: content,
        content_type: 'text'
      };
      const newMessageRef = push(ref(realtimeDb, `threads/${currentThread.id}/messages`));
      await set(newMessageRef, message);
      dispatch(addMessageToCurrentThread(message));

      if (true) { // Assuming useStreaming is always true for simplicity
        let streamedContent = '';
        await runAssistantWithStream(currentThread.id, chatbot.agentId, (update) => {
          streamedContent += update;
          const botMessage: Message = {
            id: `${Date.now()}`,
            object: 'message' as const,
            created: Date.now(),
            role: 'assistant',
            content: streamedContent,
            content_type: 'text'
          };
          const newBotMessageRef = push(ref(realtimeDb, `threads/${currentThread.id}/messages`));
          set(newBotMessageRef, botMessage);
          dispatch(addMessageToCurrentThread(botMessage));
        });
      } 
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="chat-interface">
      <ThreadSelector chatbotId={chatbotId} userId={userId} adminId={adminId} />
      {currentThread && <MessageList messages={currentThread.messages} threadId={currentThread.id} userId={userId} />}
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} threadId={currentThread?.id ?? ''} userId={userId} />
    </div>
  );
}

export default ChatInterface;
