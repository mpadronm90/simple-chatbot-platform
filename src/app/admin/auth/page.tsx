"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import AuthComponent from '../../../components/auth/AuthComponent';

const AdminAuthPage: React.FC = () => {
  const router = useRouter();

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
