import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Message } from '../../store/threadsSlice'; // Ensure this path is correct

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div>
      {messages.map((message, index) => (
        <div key={index}>{message.content}</div>
      ))}
    </div>
  );
};

export default MessageList;
