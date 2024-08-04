// AccountsPage.tsx
import React, {useState} from 'react';
import { Grid, Paper, Typography, Button, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AddAccountDialog from '../components/account/AddAccountDialog';

const AccountsPage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const accounts = useSelector((state: RootState) => state.accounts.accounts);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };


  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Accounts
      </Typography>
      <Grid container spacing={3}>
        {accounts.map((account) => (
          <Grid item xs={12} md={4} key={account.id}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">{account.name}</Typography>
              <Typography variant="body1">Balance: ${account.balance}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Box mt={2} display="flex" justifyContent="center">
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          Add New Account
        </Button>
        <AddAccountDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
        />
      </Box>
      
    </Box>
  );
};

export default AccountsPage;
