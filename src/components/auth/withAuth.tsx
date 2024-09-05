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
        const basePath = currentPath.startsWith('/chatbot') ? '/chatbot' : '/admin';
        const chatbotId = currentPath.split('/').pop();
        const redirectPath = basePath === '/chatbot' && chatbotId
          ? `${basePath}?id=${chatbotId}&type=login`
          : `${basePath}/auth?type=login`;
        window.location.href = redirectPath;
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
