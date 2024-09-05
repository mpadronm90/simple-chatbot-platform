import React from 'react';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import ClientAuthProvider from '../components/auth/ClientAuthProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <ClientAuthProvider>
          {children}
        </ClientAuthProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
