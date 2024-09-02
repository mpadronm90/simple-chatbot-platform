import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth'; // Add this import

interface AuthState {
  isAuthenticated: boolean;
  user: User | null; // Update the type here
  role: 'admin' | 'user' | null;
  adminId: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false, // Add this line
  user: null,
  role: null,
  adminId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    setUserRole(state, action: PayloadAction<{ role: 'admin' | 'user'; adminId: string | null }>) {
      state.role = action.payload.role;
      state.adminId = action.payload.adminId;
    },
  },
});

export const { setUser, setUserRole } = authSlice.actions;
export default authSlice.reducer;
