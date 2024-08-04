// src/redux/slices/transactionsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
}

const initialState: TransactionsState = {
  transactions: [
    { id: '1', accountId: '1', amount: -50, type: 'Expense', category: 'Grocery', date: '2024-07-01T12:18:46.058', description: 'Grocery shopping' },
    { id: '2', accountId: '1', amount: -100, type: 'Expense', category: 'Restaurant', date: '2024-07-02T12:18:46.058', description: 'Dinner at restaurant' },
    { id: '3', accountId: '2', amount: 500, type: 'Income', category: 'Salary', date: '2024-07-03T12:18:46.058', description: 'Monthly salary' },
    { id: '4', accountId: '1', amount: -30, type: 'Expense', category: 'Transport', date: '2024-07-04T12:18:46.058', description: 'Bus fare' },
    { id: '5', accountId: '2', amount: 200, type: 'Income', category: 'Investment', date: '2024-07-05T12:18:46.058', description: 'Investment return' },
    { id: '6', accountId: '1', amount: -75, type: 'Expense', category: 'Utilities', date: '2024-07-06T12:18:46.058', description: 'Electricity bill' },
    { id: '7', accountId: '3', amount: -150, type: 'Expense', category: 'Shopping', date: '2024-07-07T12:18:46.058', description: 'Online shopping' },
    { id: '8', accountId: '2', amount: 1000, type: 'Income', category: 'Bonus', date: '2024-07-08', description: 'Yearly bonus' },
    { id: '9', accountId: '1', amount: -25, type: 'Expense', category: 'Entertainment', date: '2024-07-09T12:18:46.058', description: 'Movie ticket' },
    { id: '10', accountId: '3', amount: -200, type: 'Expense', category: 'Travel', date: '2024-07-10T12:18:46.058', description: 'Flight booking' },
  ],
  currentTransaction: null,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction(state, action: PayloadAction<Transaction>) {
      state.transactions.push(action.payload);
    },
    updateTransaction(state, action: PayloadAction<Transaction>) {
      const index = state.transactions.findIndex(transaction => transaction.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },
    deleteTransaction(state, action: PayloadAction<string>) {
      state.transactions = state.transactions.filter(transaction => transaction.id !== action.payload);
    },
    setCurrentTransaction(state, action: PayloadAction<Transaction | null>) {
        state.currentTransaction = action.payload;
      },
  },
});

export const { addTransaction, updateTransaction, deleteTransaction, setCurrentTransaction } = transactionsSlice.actions;

export default transactionsSlice.reducer;
