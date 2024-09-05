import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  uid: string;
  email: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isAuthChecked: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isAuthChecked = true;
    },
    // ... other auth-related reducers
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
