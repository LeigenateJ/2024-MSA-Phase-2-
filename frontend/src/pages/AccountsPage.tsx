// AccountsPage.tsx
import React, {useState} from 'react';
import { Grid, Paper, Typography, Button, Box } from '@mui/material';
import { mockAccounts } from '../mockData';
import AddAccountDialog from '../components/account/AddAccountDialog';

const AccountsPage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleAddAccount = (account: { name: string; type: string; balance: number }) => {
    console.log('New Account:', account);
    // 在此处添加逻辑来处理新账户，例如发送请求到API或更新状态
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Accounts
      </Typography>
      <Grid container spacing={3}>
        {mockAccounts.map((account) => (
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
          onAdd={handleAddAccount}
        />
      </Box>
      
    </Box>
  );
};

export default AccountsPage;
