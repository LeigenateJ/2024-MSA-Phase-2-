import React, { useState } from 'react';
import { Grid, Paper, Typography, Button, Box, useMediaQuery, IconButton, Switch, FormControlLabel} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import Pagination from '@mui/material/Pagination';
import AddTransactionDialog from '../components/transaction/AddTransactionDialog';
import { calculateBalanceAtTransactionTime } from '../utils/calculateBalanceAtTransactionTime';
import {  setCurrentTransaction, deleteTransaction  } from '../redux/slices/transactionSlice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const TransactionsPage: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [page, setPage] = useState(1);
  const rowsPerPage = isSmallScreen ? 5 : 9;
  const transactions = useSelector((state: RootState) => state.transactions.transactions);
  const accounts = useSelector((state: RootState) => state.accounts.accounts);
  const dispatch: AppDispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);

  const completeTransactions = transactions.map(transaction => {
    const account = accounts.find(acc => acc.id === transaction.accountId);
    const balance = calculateBalanceAtTransactionTime(transaction.accountId, transaction.id, transactions, accounts);

    return {
      ...transaction,
      accountName: account?.name || 'Unknown',
      accountType: account?.type || 'Unknown',
      balance,
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const displayedTransactions = completeTransactions.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = (transaction?: any) => {
    if (transaction) {
      dispatch(setCurrentTransaction(transaction));
    } else {
      dispatch(setCurrentTransaction(null));
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    dispatch(deleteTransaction(transactionId));
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          Transactions
        </Typography>
        <FormControlLabel
          control={<Switch checked={editMode} onChange={toggleEditMode} />}
          label="Edit"
        />
      </Box>
      <Grid container spacing={isSmallScreen ? 2 : 3}>
        {displayedTransactions.map((transaction) => (
          <Grid item xs={12} md={4} key={transaction.id}>
            <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6">{transaction.category}</Typography>
              <Typography variant="body1">Amount: {transaction.type === 'Income' ? '+' : '-'} ${Math.abs(transaction.amount)}</Typography>
              <Typography variant="body2" color="textSecondary">
                {transaction.type} on {transaction.date.split('T')[0]}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Account: {transaction.accountName} ({transaction.accountType})
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Balance after transaction: ${transaction.balance}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Description: {transaction.description}
              </Typography>
              {editMode && (
                <Box display="flex" justifyContent="flex-end">
                  <IconButton aria-label="edit" color="primary" onClick={() => handleOpenDialog(transaction)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete" color="error" onClick={() => handleDeleteTransaction(transaction.id)}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Box mt={2} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(completeTransactions.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          color="primary"
        />
      </Box>
      <Box mt={2} display="flex" justifyContent="center">
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog(null)}>
          Add New Transaction
        </Button>
      </Box>
      <AddTransactionDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
      />
    </Box>
  );
};

export default TransactionsPage;
