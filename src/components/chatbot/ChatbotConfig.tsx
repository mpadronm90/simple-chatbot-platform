import React, { useState } from 'react';
import ChatbotPreview from './ChatbotPreview';

interface ChatbotConfigProps {
  onSave: (config: { name: string; description: string; avatarUrl: string; styles: { [key: string]: string } }) => void;
}

const ChatbotConfig: React.FC<ChatbotConfigProps> = ({ onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [styles, setStyles] = useState<{ [key: string]: string }>({});

  const handleSave = () => {
    onSave({ name, description, avatarUrl, styles });
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStyles((prevStyles) => ({ ...prevStyles, [name]: value }));
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
      <input
        type="text"
        name="backgroundColor"
        placeholder="Background Color"
        value={styles.backgroundColor || ''}
        onChange={handleStyleChange}
      />
      <input
        type="text"
        name="textColor"
        placeholder="Text Color"
        value={styles.textColor || ''}
        onChange={handleStyleChange}
      />
      <button onClick={handleSave}>Save</button>
      <ChatbotPreview name={name} description={description} avatarUrl={avatarUrl} />
    </div>
  );
};

export default ChatbotConfig;
