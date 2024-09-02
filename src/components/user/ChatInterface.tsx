import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { addMessageToCurrentThread, setCurrentThread, Message, Thread } from '../../store/threadsSlice';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ThreadSelector from './ThreadSelector';
import { addMessage, runAssistantWithStream, runAssistantWithoutStream } from '../../utils/openai';
import { ref, onValue, push, set } from 'firebase/database';
import { realtimeDb } from '../../config/firebase';

interface ChatInterfaceProps {
  chatbotId: string;
  userId: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatbotId, userId }) => {
  const dispatch = useDispatch();
  const currentThread = useSelector((state: RootState) => state.threads.currentThread);
  const assistantId = useSelector((state: RootState) => state.agents.agents[0]?.id); // Assuming the first agent is used
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
    if (!currentThread || !assistantId) return;

    setIsLoading(true);
    try {
      const message: Message = {
        id: `${Date.now()}`, // Generate a unique ID
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
        await runAssistantWithStream(currentThread.id, assistantId, (update) => {
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
      // Remove the unreachable else block
      // else {
      //   const newMessages = await runAssistantWithoutStream(currentThread?.id ?? '', assistantId);
      //   newMessages.forEach(message => {
      //     if (message.role === 'assistant') {
      //       const botMessage: Message = {
      //         id: `${Date.now()}`,
      //         object: 'message' as const,
      //         created: Date.now(),
      //         role: 'assistant',
      //         content: message.content,
      //         content_type: 'text'
      //       };
      //       const newBotMessageRef = push(ref(realtimeDb, `threads/${currentThread?.id ?? ''}/messages`));
      //       set(newBotMessageRef, botMessage);
      //       dispatch(addMessageToCurrentThread(botMessage));
      //     }
      //   });
      // }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-interface">
      <ThreadSelector userId={userId} chatbotId={chatbotId} />
      {currentThread && <MessageList messages={currentThread.messages} threadId={currentThread.id} userId={userId} />}
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} threadId={currentThread?.id ?? ''} userId={userId} />
    </div>
  );
}
export default ChatInterface;
