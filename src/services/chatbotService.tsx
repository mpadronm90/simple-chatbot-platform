import { ref, get, set } from 'firebase/database';
import { realtimeDb } from '../config/firebase';

export const getChatbotById = async (chatbotId: string) => {
  const chatbotRef = ref(realtimeDb, `chatbots/${chatbotId}`);
  const chatbotSnapshot = await get(chatbotRef);
  return chatbotSnapshot.exists() ? chatbotSnapshot.val() : null;
};

export const saveChatbotConfig = async (chatbotId: string, config: { name: string; description: string; avatarUrl: string; styles: { [key: string]: string } }) => {
  const chatbotRef = ref(realtimeDb, `chatbots/${chatbotId}`);
  await set(chatbotRef, config);
};

export const linkUserWithAdmin = async (userId: string, adminId: string) => {
  const userRef = ref(realtimeDb, `users/${userId}`);
  const userSnapshot = await get(userRef);

  if (userSnapshot.exists()) {
    const userData = userSnapshot.val();
    if (!userData.adminIds.includes(adminId)) {
      await set(userRef, { ...userData, adminIds: [...userData.adminIds, adminId] });
    }
  } else {
    await set(userRef, { adminIds: [adminId] });
  }
};
