'use client';

import React from 'react';
import { Provider } from 'react-redux';
import store from '../../store';
import ClientAuthWrapper from './ClientAuthWrapper';

const ClientAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider store={store}>
      <ClientAuthWrapper>{children}</ClientAuthWrapper>
    </Provider>
  );
};

export default ClientAuthProvider;
