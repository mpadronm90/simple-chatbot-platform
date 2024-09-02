'use client';

import { useEffect, useState } from 'react';
import { auth } from '../config/firebase';

const useCheckUserRole = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        const userRole = idTokenResult.claims.role;
        if (typeof userRole === 'string' || userRole === null) {
          setRole(userRole);
        } else {
          setRole(null);
        }
        // Handle the role as needed
      } else {
        setRole(null);
      }
    };

    checkUserRole();
  }, []);

  return role;
};

export default useCheckUserRole;
