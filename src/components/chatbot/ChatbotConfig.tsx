import React, { useState } from 'react';
import ChatbotPreview from './ChatbotPreview';

interface ChatbotConfigProps {
  onSave: (config: { name: string; description: string; avatarUrl: string }) => void;
}

const ChatbotConfig: React.FC<ChatbotConfigProps> = ({ onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const handleSave = () => {
    onSave({ name, description, avatarUrl });
  };

  return (
    <div className="chatbot-config">
      <h2>Configure Chatbot</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Avatar URL"
        value={avatarUrl}
        onChange={(e) => setAvatarUrl(e.target.value)}
      />
      <button onClick={handleSave}>Save</button>
      <ChatbotPreview name={name} description={description} avatarUrl={avatarUrl} />
    </div>
  );
};

export default ChatbotConfig;
