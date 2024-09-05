import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Loading } from '@/components/ui/loading';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const ComponentWithAuth = (props: P) => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const isAuthChecked = useSelector((state: RootState) => state.auth.isAuthChecked);
    const loading = !isAuthenticated;

    useEffect(() => {

        if (!isAuthenticated && isAuthChecked) {
          const currentPath = window.location.pathname;
          const basePath = currentPath.startsWith('/chatbot/') ? currentPath : '/admin';
          window.location.href = `${basePath}/auth?type=login`;
        }
      
    }, [isAuthenticated, isAuthChecked]);

    if (loading) {
      return <Loading />;
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
};

export default withAuth;
