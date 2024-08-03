import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    register(state, action: PayloadAction<{ username: string; password: string; email: string }>) {
        // Handle registration logic here, like calling an API
        console.log('User registered:', action.payload);
      },
  },
});

export const { startLoading, setToken, setError, logout, register } = authSlice.actions;
export default authSlice.reducer;