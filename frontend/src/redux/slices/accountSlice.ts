// src/redux/slices/accountsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  userId: string;
}

interface AccountsState {
  accounts: Account[];
}

const initialState: AccountsState = {
  accounts: [
    { id: '1', name: 'Checking Account', type: 'Checking', balance: 1500, userId: 'user1' },
    { id: '2', name: 'Savings Account', type: 'Savings', balance: 3000, userId: 'user1' },
    { id: '3', name: 'Credit Card', type: 'Credit', balance: -500, userId: 'user1' },
  ],
};

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    addAccount(state, action: PayloadAction<Account>) {
      state.accounts.push(action.payload);
    },
    updateAccount(state, action: PayloadAction<Account>) {
      const index = state.accounts.findIndex(account => account.id === action.payload.id);
      if (index !== -1) {
        state.accounts[index] = action.payload;
      }
    },
    deleteAccount(state, action: PayloadAction<string>) {
      state.accounts = state.accounts.filter(account => account.id !== action.payload);
    },
  },
});

export const { addAccount, updateAccount, deleteAccount } = accountsSlice.actions;

export default accountsSlice.reducer;
