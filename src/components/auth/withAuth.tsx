import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const withAuth = (WrappedComponent: React.FC) => {
  const ComponentWithAuth = (props: any) => {
    const [loading, setLoading] = useState(true);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const authChecked = useSelector((state: RootState) => state.auth.authChecked);

    useEffect(() => {
      if (authChecked) {
        if (!isAuthenticated) {
          const currentPath = window.location.pathname;
          const basePath = currentPath.startsWith('/chatbot/') ? currentPath : '/admin';
          window.location.href = `${basePath}/auth?type=login`;
        } else {
          setLoading(false);
        }
      }
    }, [isAuthenticated, authChecked]);

    if (loading) {
      return <div>Loading...</div>; // Or a more sophisticated loading component
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
};

export default withAuth;
