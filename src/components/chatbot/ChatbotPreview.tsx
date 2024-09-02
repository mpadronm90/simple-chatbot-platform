import React from 'react';
import Image from 'next/image'; // Add this import

interface ChatbotPreviewProps {
  name: string;
  description: string;
  avatarUrl: string;
}

const ChatbotPreview: React.FC<ChatbotPreviewProps> = ({ name, description, avatarUrl }) => {
  return (
    <div className="chatbot-preview">
      <Image src={avatarUrl} alt={`${name} avatar`} className="chatbot-avatar" width={100} height={100} />
      <h2>{name}</h2>
      <p>{description}</p>
    </div>
  );
};

export default ChatbotPreview;
