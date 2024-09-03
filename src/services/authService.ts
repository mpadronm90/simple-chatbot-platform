import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import store from "../store";
import { setUser, setIsAuthenticated } from '../store/authSlice';

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