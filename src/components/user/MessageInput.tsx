import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessageToCurrentThread } from '../../store/threadsSlice';
import { RootState } from '../../store';
import openai from '../../utils/openai';

interface MessageInputProps {
  chatbotId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ chatbotId }) => {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const currentThread = useSelector((state: RootState) => state.threads.currentThread);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentThread) return;

    // Add user message to the thread
    dispatch(addMessageToCurrentThread({
      sender: 'user',
      content: message,
      timestamp: new Date().toISOString()
    }));

    // Call OpenAI API to get bot response
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message }
        ],
      });

      // Add bot response to the thread
      dispatch(addMessageToCurrentThread({
        sender: 'bot',
        content: completion.choices[0].message.content || 'Sorry, I couldn\'t generate a response.',
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error getting response from OpenAI:', error);
      // Handle error (e.g., show error message to user)
    }

    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageInput;
