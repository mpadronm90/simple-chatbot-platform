"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthComponent from '../../../components/auth/AuthComponent';
import { Loading } from '@/components/ui/loading';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const AdminAuthPage: React.FC = () => {
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isAuthChecked = useSelector((state: RootState) => state.auth.isAuthChecked);

  const loading = !isAuthenticated && !isAuthChecked;

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  if (loading) {
    return <Loading />;
  } else if (isAuthenticated) {
    return <Loading text="Redirecting to admin..." />;
  }

  const handleAuthSuccess = () => {
    router.push('/admin');
  };

  return (
    <div className="container flex justify-center items-center min-h-screen bg-gray-100">
      <AuthComponent onAuthSuccess={handleAuthSuccess} />
    </div>
  );
};

export default AdminAuthPage;
