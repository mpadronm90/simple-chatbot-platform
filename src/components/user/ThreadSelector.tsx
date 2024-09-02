import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setThreads, setCurrentThread } from '../../store/threadsSlice';
import { RootState } from '../../store';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Thread } from '../../types';

interface ThreadSelectorProps {
  userId: string;
  chatbotId: string;
}

const ThreadSelector: React.FC<ThreadSelectorProps> = ({ userId, chatbotId }) => {
  const dispatch = useDispatch();
  const threads = useSelector((state: RootState) => state.threads.threads);

  useEffect(() => {
    const fetchThreads = async () => {
      const q = query(
        collection(db, 'threads'),
        where('userId', '==', userId),
        where('chatbotId', '==', chatbotId)
      );
      const querySnapshot = await getDocs(q);
      const fetchedThreads = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        userId,
        chatbotId,
        messages: (doc.data().messages || []).map((msg: any) => ({
          timestamp: msg.timestamp,
          sender: msg.sender as "user" | "bot",
          content: msg.content || ''
        }))
      })) as {
        id: string;
        userId: string;
        chatbotId: string;
        messages: {
          timestamp: string;
          sender: "user" | "bot";
          content: string;
        }[];
      }[];
      dispatch(setThreads(fetchedThreads));
    };

    fetchThreads();
  }, [userId, chatbotId, dispatch]);

  const handleThreadSelect = (threadId: string) => {
    const selectedThread = threads.find(thread => thread.id === threadId);
    if (selectedThread) {
      dispatch(setCurrentThread(selectedThread));
    }
  };

  return (
    <div>
      <h3>Your Conversations</h3>
      <ul>
        {threads.map(thread => (
          <li key={thread.id} onClick={() => handleThreadSelect(thread.id)}>
            {new Date(thread.messages[0].timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThreadSelector;
