import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const MessageList: React.FC = () => {
  const currentThread = useSelector((state: RootState) => state.threads.currentThread);

  if (!currentThread) {
    return <div>No active conversation</div>;
  }

  return (
    <div className="message-list">
      {currentThread.messages.map((message, index) => (
        <div key={index} className={`message ${message.sender}`}>
          <p>{message.content}</p>
          <small>{new Date(message.timestamp).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
