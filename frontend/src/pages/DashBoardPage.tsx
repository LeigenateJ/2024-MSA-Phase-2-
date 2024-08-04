import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const DashboardPage: React.FC = () => {
  const accounts = useSelector((state: RootState) => state.accounts.accounts);
  const transactions = useSelector((state: RootState) => state.transactions.transactions);

  const totalBalance = accounts.reduce((acc, account) => acc + account.balance, 0);
  const totalIncome = transactions
    .filter(transaction => transaction.type === 'Income')
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  const totalExpense = transactions
    .filter(transaction => transaction.type === 'Expense')
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  const recentTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Current Total Balance</Typography>
            <Typography variant="h4">${totalBalance}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Total Income</Typography>
            <Typography variant="h4">${totalIncome}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Total Expense</Typography>
            <Typography variant="h4">${totalExpense}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Recent Transactions</Typography>
            {recentTransactions.slice(0, 5).map((transaction) => (
              <Box key={transaction.id}>
                <Typography>{transaction.category} {transaction.type === 'Income' ? '+' : '-'} ${Math.abs(transaction.amount)}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
