import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import store from "../store";
import { setUser, setIsAuthenticated } from '../store/authSlice';
import { ref, get, set } from 'firebase/database';
import { realtimeDb } from './firebase';

const handleLogout = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
  }
  return false;
};

export default handleLogout;

export const monitorAuthState = () => {
	onAuthStateChanged(auth, async (user) => {
		if (user) {
			store.dispatch(setUser({uid: user.uid, email: user.email}));
            store.dispatch(setIsAuthenticated(true));
		} else {
			store.dispatch(setUser(null));
            store.dispatch(setIsAuthenticated(false));
		}
	});
};

export const linkUserWithAdmin = async (userId: string, adminId: string) => {
  const userRef = ref(realtimeDb, `users/${adminId}`);
  const userSnapshot = await get(userRef);

  if (userSnapshot.exists()) {
    const userData = userSnapshot.val();
    if (!userData.userIds.includes(userId)) {
      await set(userRef, { ...userData, userIds: [...userData.userIds, userId] });
    }
  } else {
    await set(userRef, { userIds: [userId] });
  }
};