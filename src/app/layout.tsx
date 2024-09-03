'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Inter } from 'next/font/google';
import StoreProvider from './StoreProvider';
import './globals.css';
import { monitorAuthState } from '../services/authService';
import store from '../store';

const inter = Inter({ subsets: ["latin"] });

const ClientWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    monitorAuthState();
  }, []);

  return <>{children}</>;
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <StoreProvider>
            <ClientWrapper>{children}</ClientWrapper>
          </StoreProvider>
        </Provider>
      </body>
    </html>
  );
}
