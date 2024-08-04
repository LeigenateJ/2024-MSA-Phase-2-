import React, { useState } from 'react';
import { Grid, Paper, Typography, Button, Box, IconButton, Switch, FormControlLabel } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import AddAccountDialog from '../components/account/AddAccountDialog';
import { setCurrentAccount, deleteAccount, fetchAccounts } from '../redux/slices/accountSlice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const AccountsPage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const accounts = useSelector((state: RootState) => state.accounts.accounts);
  const dispatch: AppDispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);

  const handleOpenDialog = (account?: any) => {
    if (account) {
      dispatch(setCurrentAccount(account));
    } else {
      dispatch(setCurrentAccount(null));
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleDeleteAccount = (accountId: string) => {
    dispatch(deleteAccount(accountId));
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          Accounts
        </Typography>
        <FormControlLabel
          control={<Switch checked={editMode} onChange={toggleEditMode} />}
          label="Edit"
        />
      </Box>
      <Grid container spacing={3}>
        {accounts.map((account) => (
          <Grid item xs={12} md={4} key={account.id}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">{account.name}</Typography>
              <Typography variant="body1">{account.type} Account</Typography>
              <Typography variant="body1">Balance: ${account.balance}</Typography>
              {editMode && (
                <Box display="flex" justifyContent="flex-end">
                  <IconButton aria-label="edit" color="primary" onClick={() => handleOpenDialog(account)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete" color="error" onClick={() => handleDeleteAccount(account.id)}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Box mt={2} display="flex" justifyContent="center">
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
          Add New Account
        </Button>
      </Box>
      <AddAccountDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
      />
    </Box>
  );
};

export default AccountsPage;
