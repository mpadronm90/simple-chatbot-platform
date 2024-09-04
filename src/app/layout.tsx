'use client';

import React from 'react';
import { Provider } from 'react-redux';
import StoreProvider from './StoreProvider';
import './globals.css';
import store from '../store';
import { Toaster } from 'react-hot-toast';
import AuthStateListener from '../components/auth/AuthStateListener';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Provider store={store}>
          <StoreProvider>
            <AuthStateListener />
            {children}
          </StoreProvider>
        </Provider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
