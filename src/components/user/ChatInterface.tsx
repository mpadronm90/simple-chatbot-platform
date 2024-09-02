import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setCurrentThread, addMessageToCurrentThread, Message } from '../../store/threadsSlice';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { createAssistant, createThread, addMessage, runAssistantWithStream, runAssistantWithoutStream } from '../../utils/openai';

const ChatInterface: React.FC = () => {
  const dispatch = useDispatch();
  const currentThread = useSelector((state: RootState) => state.threads.currentThread);
  const messages = useSelector((state: RootState) => state.threads.currentThread?.messages || []);
  const [isLoading, setIsLoading] = useState(false);
  const [assistantId, setAssistantId] = useState<string | null>(null);
  const [useStreaming, setUseStreaming] = useState(true);

  useEffect(() => {
    initializeAssistant();
  }, []);

  const initializeAssistant = async () => {
    try {
      const assistant = await createAssistant("ChatbotAssistant", "You are a helpful assistant.");
      setAssistantId(assistant.id);
    } catch (error) {
      console.error('Failed to initialize assistant:', error);
    }
  };

  const initializeThread = useCallback(async () => {
    try {
      const thread = await createThread();
      const formattedThread = {
        ...thread,
        userId: (thread as any).userId || '', // Ensure userId is set
        chatbotId: (thread as any).chatbotId || '', // Ensure chatbotId is set
        messages: (thread as any).messages || [], // Ensure messages is an array
      };
      dispatch(setCurrentThread(formattedThread));
    } catch (error) {
      console.error('Failed to initialize thread:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!currentThread) {
      initializeThread();
    }
  }, [currentThread, initializeThread]);

  const handleSendMessage = async (content: string) => {
    if (!currentThread || !assistantId) return;

    setIsLoading(true);
    try {
      const message: Message = {
        id: `${Date.now()}`, // Generate a unique ID
        object: 'message', // Explicitly set the type to "message"
        created: Date.now(),
        role: 'user',
        content: content,
        content_type: 'text'
      };
      await addMessage(currentThread.id, message.id); // Pass message.id instead of message
      dispatch(addMessageToCurrentThread(message));

      if (useStreaming) {
        let streamedContent = '';
        await runAssistantWithStream(currentThread.id, assistantId, (update) => {
          streamedContent += update;
          const botMessage: Message = {
            id: `${Date.now()}`,
            object: 'message' as const, // Explicitly type as "message"
            created: Date.now(),
            role: 'assistant',
            content: streamedContent,
            content_type: 'text'
          };
          dispatch(addMessageToCurrentThread(botMessage));
        });
      } else {
        const newMessages = await runAssistantWithoutStream(currentThread.id, assistantId);
        newMessages.forEach(message => {
          if (message.role === 'assistant') {
            const botMessage: Message = {
              id: `${Date.now()}`,
              object: 'message' as const, // Explicitly type as "message"
              created: Date.now(),
              role: 'assistant',
              content: message.content.join(' '),
              content_type: 'text'
            };
            dispatch(addMessageToCurrentThread(botMessage));
          }
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <MessageList messages={currentThread?.messages || []} />
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
export default ChatInterface;
