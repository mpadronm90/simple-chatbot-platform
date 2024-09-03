import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: {
    uid: string | null;
    email: string | null;
    // Add other necessary fields
  } | null;
  isAuthenticated: boolean;
  authChecked: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  authChecked: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = action.payload;
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
      state.authChecked = true;
    },
  },
});

export const { setUser, setIsAuthenticated } = authSlice.actions;
export default authSlice.reducer;
