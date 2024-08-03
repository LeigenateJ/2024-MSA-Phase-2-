// DashboardPage.tsx
import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { mockAccounts, mockTransactions } from '../mockData';

const DashboardPage: React.FC = () => {
  const totalBalance = mockAccounts.reduce((acc, account) => acc + account.balance, 0);
  const totalIncome = mockTransactions
    .filter(transaction => transaction.type === 'Income')
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  const totalExpense = mockTransactions
    .filter(transaction => transaction.type === 'Expense')
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Total Balance</Typography>
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
            {mockTransactions.slice(0, 5).map((transaction) => (
              <Box key={transaction.id}>
                <Typography>{transaction.category} - ${transaction.amount}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
