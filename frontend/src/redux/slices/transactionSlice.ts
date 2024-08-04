import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import { fetchAccounts } from './accountSlice';

interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  type: string;
  category: string;
  date: string;
  description: string;
}

interface TransactionsState {
  transactions: Transaction[];
  currentTransaction: Transaction | null;
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  transactions: [],
  currentTransaction: null,
  loading: false,
  error: null,
};

// Fetch transactions for a specific user
export const fetchTransactions = createAsyncThunk(
    'transactions/fetchTransactions',
    async (userId: string, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get<Transaction[]>(`/Users/${userId}/transactions`);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
      }
    }
  );

// Create a new transaction
export const createTransaction = createAsyncThunk(
    'transactions/createTransaction',
    async (newTransaction: Omit<Transaction, 'id'>, { rejectWithValue, dispatch }) => {
      try {
        const response = await axiosInstance.post<Transaction>('/transactions', newTransaction);
        dispatch(fetchAccounts()); // Refresh accounts after creating a transaction
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create transaction');
      }
    }
  );
  
  // Update a transaction
  export const updateTransaction = createAsyncThunk(
    'transactions/updateTransaction',
    async (updatedTransaction: Transaction, { rejectWithValue, dispatch }) => {
      try {
        await axiosInstance.put(`/transactions/${updatedTransaction.id}`, updatedTransaction);
        dispatch(fetchAccounts()); // Refresh accounts after updating a transaction
        return updatedTransaction;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update transaction');
      }
    }
  );
  
  // Delete a transaction
  export const deleteTransaction = createAsyncThunk(
    'transactions/deleteTransaction',
    async (transactionId: string, { rejectWithValue, dispatch }) => {
      try {
        await axiosInstance.delete(`/transactions/${transactionId}`);
        dispatch(fetchAccounts()); // Refresh accounts after deleting a transaction
        return transactionId;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete transaction');
      }
    }
  );

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setCurrentTransaction(state, action: PayloadAction<Transaction | null>) {
      state.currentTransaction = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.transactions.push(action.payload);
      })
      .addCase(updateTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        const index = state.transactions.findIndex(transaction => transaction.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(deleteTransaction.fulfilled, (state, action: PayloadAction<string>) => {
        state.transactions = state.transactions.filter(transaction => transaction.id !== action.payload);
      });
  },
});

export const { setCurrentTransaction } = transactionsSlice.actions;

export default transactionsSlice.reducer;
