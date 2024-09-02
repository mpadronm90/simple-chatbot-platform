'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import AdminDashboard from '../../components/admin/AdminDashboard';
import withAdminAuth from '../../components/admin/withAdminAuth';

export default withAdminAuth(function AdminPage() {
  const role = useSelector((state: RootState) => state.auth.role);

  if (role !== 'admin') {
    return <div>Please log in as an admin</div>;
  }

  return (
    <main className="admin-dashboard flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>
      <AdminDashboard />
    </main>
  );
});