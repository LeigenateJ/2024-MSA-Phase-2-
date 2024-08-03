import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  FormHelperText
} from '@mui/material';
import { mockAccounts } from '../../mockData';

interface AddTransactionDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (transaction: { accountId: string; amount: number; type: string; category: string; date: Date; description: string }) => void;
}

const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({ open, onClose, onAdd }) => {
  const [accountId, setAccountId] = useState('');
  const [amount, setAmount] = useState<number | null>(null);
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [description, setDescription] = useState('');

  const handleAdd = () => {
    if (accountId && amount !== null && type && category && date && description) {
      onAdd({ accountId, amount, type, category, date, description });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Add New Transaction</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel>Account</InputLabel>
          <Select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value as string)}
            required
          >
            {mockAccounts.map(account => (
              <MenuItem key={account.id} value={account.id}>
                {account.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Amount"
          type="number"
          fullWidth
          value={amount !== null ? amount : ''}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          required
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as string)}
            required
          >
            <MenuItem value="Income">Income</MenuItem>
            <MenuItem value="Expense">Expense</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Category"
          fullWidth
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <TextField
          margin="dense"
          label="Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={date ? date.toISOString().split('T')[0] : ''}
          onChange={(e) => setDate(new Date(e.target.value))}
          required
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAdd} color="primary" disabled={!accountId || amount === null || !type || !category || !date || !description}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTransactionDialog;
