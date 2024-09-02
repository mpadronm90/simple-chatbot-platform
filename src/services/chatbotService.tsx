import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

export const getChatbotById = async (chatbotId: string) => {
  const db = getFirestore();
  const chatbotDoc = await getDoc(doc(db, 'chatbots', chatbotId));
  return chatbotDoc.exists() ? chatbotDoc.data() : null;
};

export const linkUserWithAdmin = async (userId: string, adminId: string) => {
  const db = getFirestore();
  const userDoc = doc(db, 'users', userId);
  const userSnapshot = await getDoc(userDoc);

  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();
    if (!userData.adminIds.includes(adminId)) {
      await setDoc(userDoc, { adminIds: [...userData.adminIds, adminId] }, { merge: true });
    }
  } else {
    await setDoc(userDoc, { adminIds: [adminId] });
  }
};
