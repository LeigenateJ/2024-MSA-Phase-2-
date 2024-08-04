// src/redux/slices/accountsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import { fetchTransactions } from './transactionSlice';
import { RootState } from '../store';

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  userId: string;
}

interface AccountsState {
  accounts: Account[];
  currentAccount: Account | null;
  loading: boolean;
  error: string | null;
}

const initialState: AccountsState = {
  accounts: [],
  currentAccount: null,
  loading: false,
  error: null,
};

// Fetch all accounts
export const fetchAccounts = createAsyncThunk('accounts/fetchAccounts', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<Account[]>('/accounts');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch accounts');
  }
});

// Add a new account
export const addAccount = createAsyncThunk('accounts/addAccount', async (newAccount: Omit<Account, 'id'>, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<Account>('/accounts', newAccount);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add account');
  }
});

// Update account
export const updateAccount = createAsyncThunk('accounts/updateAccount', async (account: Account, { rejectWithValue }) => {
  try {
    await axiosInstance.put(`/accounts/${account.id}`, account);
    return account;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update account');
  }
});

// Delete account
export const deleteAccount = createAsyncThunk(
    'accounts/deleteAccount',
    async (accountId: string, { rejectWithValue, dispatch, getState }) => {
      try {
        await axiosInstance.delete(`/accounts/${accountId}`);
        const state = getState() as RootState; 
        const userId = state.auth.user?.id;
        if (userId) {
          dispatch(fetchTransactions(userId)); 
        }
        return accountId;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete account');
      }
    }
  );


const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setCurrentAccount(state, action: PayloadAction<Account | null>) {
      state.currentAccount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action: PayloadAction<Account[]>) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAccount.fulfilled, (state, action: PayloadAction<Account>) => {
        state.accounts.push(action.payload);
      })
      .addCase(updateAccount.fulfilled, (state, action: PayloadAction<Account>) => {
        const index = state.accounts.findIndex(account => account.id === action.payload.id);
        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
      })
      .addCase(deleteAccount.fulfilled, (state, action: PayloadAction<string>) => {
        state.accounts = state.accounts.filter(account => account.id !== action.payload);
      });
  },
});

export const { setCurrentAccount } = accountsSlice.actions;

export default accountsSlice.reducer;
