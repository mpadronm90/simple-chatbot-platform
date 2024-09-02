import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setThreads, setCurrentThread } from '../../store/threadsSlice';
import { RootState } from '../../store';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Thread } from '../../store/threadsSlice';

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
          id: msg.id,
          object: 'message',
          created: Number(msg.created), // Ensure created is a number
          role: msg.role,
          content: msg.content || '',
          content_type: msg.content_type,
          metadata: msg.metadata
        }))
      })) as {
        id: string;
        userId: string;
        chatbotId: string;
        messages: {
          id: string;
          object: 'message';
          created: number; // Ensure created is a number
          role: 'system' | 'user' | 'assistant';
          content: string;
          content_type: 'text' | 'image' | 'audio' | 'video' | 'file';
          metadata?: Record<string, string>;
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
            {new Date(thread.messages[0].created).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThreadSelector;
