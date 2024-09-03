"use client";

import React from 'react';
import handleLogout from '../../services/authService';

const AdminHeader: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Portal</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300 ease-in-out"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
