'use client';

import React from 'react';
import AdminDashboard from '../../components/admin/AdminDashboard';
import withAdminAuth from '../../components/admin/withAdminAuth';

export default withAdminAuth(function AdminPage() {
  return (
    <main className="admin-dashboard flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>
      <AdminDashboard />
    </main>
  );
});