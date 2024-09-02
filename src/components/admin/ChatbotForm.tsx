import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addChatbot } from '../../store/chatbotsSlice';

const ChatbotForm: React.FC = () => {
  const [name, setName] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addChatbot({ id: Date.now().toString(), name, agentId: '', prompt: '', appearance: { color: '', font: '', size: '' } }));
    setName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Chatbot name"
      />
      <button type="submit">Add Chatbot</button>
    </form>
  );
};

export default ChatbotForm;
