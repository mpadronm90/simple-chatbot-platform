import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserRole } from '../store/authSlice';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; // Ensure this import is present

const useCheckUserRole = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUserRole = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        const role = idTokenResult.claims.role;
        const adminId = idTokenResult.claims.adminId;
        dispatch(setUserRole({ role, adminId }));
      }
    };

    checkUserRole();
  }, [dispatch]);
};

export default useCheckUserRole;
