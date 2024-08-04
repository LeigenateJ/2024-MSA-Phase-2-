import { createSlice, PayloadAction, createAsyncThunk  } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
  }

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  user: null,
};

// login
export const login = createAsyncThunk(
    'auth/login',
    async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
      try {
        const response = await axios.post('https://localhost:7045/api/users/login', { username, password });
        return response.data;
      } catch (error: any) {
        if (error.response && error.response.data) {
          return rejectWithValue(error.response.data.message);
        }
        return rejectWithValue(error.message);
      }
    }
  );
  
  // register
  export const register = createAsyncThunk(
    'auth/register',
    async ({ username, password, email }: { username: string; password: string; email: string;}, { rejectWithValue }) => {
      try {
        const response = await axios.post('https://localhost:7045/api/users/register', { username, password, email, role: 'User'});
        return response.data;
      } catch (error: any) {
        if (error.response && error.response.data) {
          return rejectWithValue(error.response.data.message);
        }
        return rejectWithValue(error.message);
      }
    }
  );

  const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      startLoading(state) {
        state.loading = true;
        state.error = null;
      },
      logout(state) {
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        state.user = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(login.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(login.fulfilled, (state, { payload }) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.token = payload.token;
          state.user = payload.user;
        })
        .addCase(login.rejected, (state, { payload }) => {
          state.loading = false;
          state.isAuthenticated = false;
          state.error = payload as string;
        })
        .addCase(register.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(register.fulfilled, (state, { payload }) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.token = payload.token;
          state.user = payload.user;
        })
        .addCase(register.rejected, (state, { payload }) => {
          state.loading = false;
          state.isAuthenticated = false;
          state.error = payload as string;
        });
    },
  });

export const { startLoading, logout } = authSlice.actions;
export default authSlice.reducer;