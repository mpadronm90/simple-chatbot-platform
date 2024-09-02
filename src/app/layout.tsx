'use client';

import React, { useEffect, ReactNode } from 'react';
import { Inter } from 'next/font/google';
import StoreProvider from './StoreProvider';
import './globals.css';
import useCheckUserRole from '../hooks/useCheckUserRole';

const inter = Inter({ subsets: ["latin"] });

const ClientWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  useCheckUserRole();

  return <>{children}</>;
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <ClientWrapper>{children}</ClientWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}
