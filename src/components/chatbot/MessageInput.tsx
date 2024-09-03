import React, { useState, useEffect } from 'react';
import { ref, set } from 'firebase/database';
import { realtimeDb } from '../../services/firebase';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  threadId: string;
  userId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading, threadId, userId }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isTyping) {
      const typingRef = ref(realtimeDb, `threads/${threadId}/typing/${userId}`);
      set(typingRef, true);
      const timeout = setTimeout(() => {
        set(typingRef, false);
        setIsTyping(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isTyping, threadId, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSendMessage(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          setIsTyping(true);
        }}
        placeholder="Type your message..."
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>Send</button>
    </form>
  );
};

export default MessageInput;
