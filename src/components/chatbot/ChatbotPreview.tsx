import React from 'react';

interface ChatbotPreviewProps {
  name: string;
  description: string;
  avatarUrl: string;
}

const ChatbotPreview: React.FC<ChatbotPreviewProps> = ({ name, description, avatarUrl }) => {
  return (
    <div className="chatbot-preview">
      <img src={avatarUrl} alt={`${name} avatar`} className="chatbot-avatar" />
      <h2>{name}</h2>
      <p>{description}</p>
    </div>
  );
};

export default ChatbotPreview;
