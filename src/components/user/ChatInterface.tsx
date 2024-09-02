import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { setUser } from '../../store/authSlice';
import { RootState } from '../../store';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ThreadSelector from './ThreadSelector';

interface ChatInterfaceProps {
  chatbotId: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatbotId }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleAuth = async (e: React.FormEvent, isLogin: boolean) => {
    e.preventDefault();
    try {
      const authFunction = isLogin ? signInWithEmailAndPassword : createUserWithEmailAndPassword;
      const userCredential = await authFunction(auth, email, password);
      dispatch(setUser(userCredential.user));
    } catch (error) {
      console.error('Authentication error:', error);
      // Handle auth error (show message to user)
    }
  };

  if (!user) {
    return (
      <div>
        <form onSubmit={(e) => handleAuth(e, true)}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
        <button onClick={(e) => handleAuth(e, false)}>Sign Up</button>
      </div>
    );
  }

  return (
    <div>
      <ThreadSelector userId={user.uid} chatbotId={chatbotId} />
      <MessageList />
      <MessageInput chatbotId={chatbotId} />
    </div>
  );
};

export default ChatInterface;
