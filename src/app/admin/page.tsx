'use client';

import React from 'react';
import AdminDashboard from '../../components/admin/AdminDashboard';
import withAuth from '../../components/auth/withAuth';
import AdminHeader from '@/components/admin/AdminHeader';

export default withAuth(function AdminPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <AdminHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <AdminDashboard />
      </main>
    </div>
  );
});