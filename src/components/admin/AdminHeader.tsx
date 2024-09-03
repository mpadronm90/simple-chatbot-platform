"use client";

import React from 'react';
import handleLogout from '../../services/authService';
import { Button } from "@/components/ui/button";

const AdminHeader: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Admin Portal</h1>
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-gray-700"
        >
          Logout
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
