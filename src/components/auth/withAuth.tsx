import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '../../store';
import { Loading } from '@/components/ui/loading';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const ComponentWithAuth = (props: P) => {
    const router = useRouter();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const isAuthChecked = useSelector((state: RootState) => state.auth.isAuthChecked);
    const loading = !isAuthenticated && !isAuthChecked;

    useEffect(() => {
      if (!isAuthenticated && isAuthChecked) {
        const currentPath = window.location.pathname;
        const basePath = currentPath.startsWith('/chatbot') ? '/chatbot' : '/admin';
        const chatbotId = currentPath.split('/').pop();
        const redirectPath = basePath === '/chatbot' && chatbotId
          ? `${basePath}?id=${chatbotId}&type=login`
          : `${basePath}/auth?type=login`;
        router.push(redirectPath);
      }
    }, [isAuthenticated, isAuthChecked, router]);

    if (loading) {
      return <Loading />;
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
};

export default withAuth;
