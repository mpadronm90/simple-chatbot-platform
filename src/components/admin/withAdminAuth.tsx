import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const withAdminAuth = (WrappedComponent: React.FC) => {
  const ComponentWithAuth = (props: any) => {
    const [isMounted, setIsMounted] = useState(false);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    useEffect(() => {
      setIsMounted(true);
    }, []);

    useEffect(() => {
      if (isMounted && !isAuthenticated) {
        window.location.href = '/admin/auth?type=login';
      }
    }, [isMounted, isAuthenticated]);

    if (!isMounted) {
      return null; // Ensure this code runs only after the component is mounted
    }

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  return ComponentWithAuth;
};

export default withAdminAuth;
