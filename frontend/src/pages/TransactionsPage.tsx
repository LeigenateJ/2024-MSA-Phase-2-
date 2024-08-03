import React, { useState } from 'react';
import { Grid, Paper, Typography, Button, Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { mockTransactions, mockAccounts } from '../mockData';
import Pagination from '@mui/material/Pagination';
import AddTransactionDialog from '../components/transaction/AddTransactionDialog';

const calculateBalanceAtTransactionTime = (accountId: string, transactionId: string) => {
  const relevantTransactions = mockTransactions
    .filter(transaction => transaction.accountId === accountId)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  let balance = mockAccounts.find(account => account.id === accountId)?.balance || 0;

  for (const transaction of relevantTransactions) {
    if (transaction.id === transactionId) break;
    balance += transaction.type === 'Income' ? transaction.amount : -transaction.amount;
  }

  return balance;
};

const TransactionsPage: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = isSmallScreen ? 5 : 9;

  const transactions = mockTransactions.map(transaction => {
    const account = mockAccounts.find(acc => acc.id === transaction.accountId);
    const balance = calculateBalanceAtTransactionTime(transaction.accountId, transaction.id);

    return {
      ...transaction,
      accountName: account?.name || 'Unknown',
      accountType: account?.type || 'Unknown',
      balance,
    };
  });

  const displayedTransactions = transactions.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleAddTransaction = (newTransaction: { accountId: string; amount: number; type: string; category: string; date: Date; description: string }) => {
    console.log('New Transaction:', newTransaction);
    // 在此处添加逻辑来处理新交易，例如发送请求到API或更新状态
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Transactions
      </Typography>
      <Grid container spacing={isSmallScreen ? 2 : 3}>
        {displayedTransactions.map((transaction) => (
          <Grid item xs={12} md={4} key={transaction.id}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">{transaction.description}</Typography>
              <Typography variant="body1">Amount: ${transaction.amount}</Typography>
              <Typography variant="body2" color="textSecondary">
                {transaction.type} on {transaction.date.toDateString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Account: {transaction.accountName} ({transaction.accountType})
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Balance after transaction: ${transaction.balance}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Box mt={2} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(transactions.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          color="primary"
        />
      </Box>
      <Box mt={2} display="flex" justifyContent="center">
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          Add New Transaction
        </Button>
      </Box>
      <AddTransactionDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onAdd={handleAddTransaction}
      />
    </Box>
  );
};

export default TransactionsPage;
