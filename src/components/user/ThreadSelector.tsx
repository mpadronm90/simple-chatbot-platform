import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentThread, Thread } from '../../store/threadsSlice';
import { RootState } from '../../store';
import { ref, onValue } from 'firebase/database';
import { realtimeDb } from '../../config/firebase';

interface ThreadSelectorProps {
  chatbotId: string;
}

const ThreadSelector: React.FC<ThreadSelectorProps> = ({ chatbotId }) => {
  const dispatch = useDispatch();
  const threads = useSelector((state: RootState) => state.threads.threads);

  useEffect(() => {
    const fetchThreads = async () => {
      const threadsRef = ref(realtimeDb, 'threads');
      onValue(threadsRef, (snapshot) => {
        const fetchedThreads: Thread[] = [];
        snapshot.forEach((childSnapshot) => {
          const thread = childSnapshot.val();
          if (thread.chatbotId === chatbotId) {
            fetchedThreads.push({ id: childSnapshot.key, ...thread });
          }
        });
        dispatch(setCurrentThread(fetchedThreads[0] || null));
      });
    };

    fetchThreads();
  }, [chatbotId, dispatch]);

  return (
    <div className="thread-selector">
      <h3>Select a Thread</h3>
      <ul>
        {threads.map(thread => (
          <li key={thread.id} onClick={() => dispatch(setCurrentThread(thread))}>
            {thread.id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThreadSelector;
