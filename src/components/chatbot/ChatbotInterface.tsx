import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Chatbot from './Chatbot';
import LoginSignup from './LoginSignup';
import { getChatbotById, linkUserWithAdmin } from '../../services/chatbotService';

const ChatbotInterface = () => {
  const [isClient, setIsClient] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [adminId, setAdminId] = useState(null);
  const [chatbotExists, setChatbotExists] = useState(false);
  const [chatbotIdString, setChatbotIdString] = useState('');

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const pathSegments = window.location.pathname.split('/');
      const chatbotId = pathSegments[pathSegments.length - 1];
      setChatbotIdString(chatbotId);
    }
  }, []);

  useEffect(() => {
    const fetchChatbot = async () => {
      if (chatbotIdString) {
        const chatbot = await getChatbotById(chatbotIdString);
        if (chatbot) {
          setAdminId(chatbot.adminId);
        } else {
          setChatbotExists(false);
        }
      }
    };

    fetchChatbot();
  }, [chatbotIdString]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        if (adminId !== null) {
          await linkUserWithAdmin(user.uid, adminId);
        }
      } else {
        setUserId(null);
      }
    });
  }, [adminId]);

  if (!isClient) {
    return null;
  }

  if (!chatbotExists) {
    return <p>Chatbot does not exist</p>;
  }

  if (!userId) {
    return <LoginSignup />;
  }

  return <Chatbot chatbotId={chatbotIdString} userId={userId} adminId={adminId || ''} />;
};

export default ChatbotInterface;
