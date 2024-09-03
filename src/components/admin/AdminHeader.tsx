"use client";

import React from 'react';
import handleLogout from '../../services/authService';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const AdminHeader: React.FC = () => {
  return (
    <Card className="bg-gray-800 text-white shadow-md">
      <CardHeader className="container mx-auto px-4 py-4 flex justify-between items-center">
        <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
        <CardContent className="p-0">
          <Button
            onClick={handleLogout}
            variant="destructive"
          >
            Logout
          </Button>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default AdminHeader;
