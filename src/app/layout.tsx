'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import StoreProvider from './StoreProvider';
import './globals.css'; // Corrected import
import { monitorAuthState } from '../services/authService';
import store from '../store';

const ClientWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    monitorAuthState();
  }, []);

  return <>{children}</>;
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans"> {/* Using a system font fallback */}
        <Provider store={store}>
          <StoreProvider>
            <ClientWrapper>{children}</ClientWrapper>
          </StoreProvider>
        </Provider>
      </body>
    </html>
  );
}
