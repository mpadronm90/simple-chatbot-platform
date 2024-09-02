import { auth } from "../config/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import store from "../store";
import { setUser, setUserRole } from '../store/authSlice';

export const monitorAuthState = () => {
	onAuthStateChanged(auth, async (user) => {
		if (user) {
			try {
				const db = getDatabase();
				const userRef = ref(db, `users/${user.uid}`);
				const userSnapshot = await get(userRef);
				if (userSnapshot.exists()) {
					const userData = userSnapshot.val();
					store.dispatch(setUser(user));
					store.dispatch(setUserRole({role: userData?.role || null, adminId: userData?.adminId || null}));
				} else {
					store.dispatch(setUser(null));
					store.dispatch(setUserRole({ role: null, adminId: null }));
				}
			} catch (error) {
				console.error('Error fetching user data:', error);
				store.dispatch(setUser(null));
				store.dispatch(setUserRole({ role: null, adminId: null }));
			}
		} else {
			store.dispatch(setUser(null));
			store.dispatch(setUserRole({ role: null, adminId: null }));
		}
	});
};