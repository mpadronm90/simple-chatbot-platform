import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentThread, fetchThreads, Thread } from '../../store/threadsSlice';
import { RootState, AppDispatch } from '../../store';

interface ThreadSelectorProps {
  chatbotId: string;
  userId: string;
  adminId: string;
}

const ThreadSelector: React.FC<ThreadSelectorProps> = ({ chatbotId, userId, adminId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const threads = useSelector((state: RootState) => state.threads.threads);

  useEffect(() => {
    dispatch(fetchThreads({ userId, chatbotId, adminId }));
  }, [chatbotId, userId, adminId, dispatch]);

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
