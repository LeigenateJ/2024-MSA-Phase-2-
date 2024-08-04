import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { createTransaction, updateTransaction, setCurrentTransaction } from '../../redux/slices/transactionSlice';

interface AddTransactionDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({ open, onClose }) => {
  const dispatch: AppDispatch = useDispatch();
  const accounts = useSelector((state: RootState) => state.accounts.accounts);
  const currentTransaction = useSelector((state: RootState) => state.transactions.currentTransaction);

  const [accountId, setAccountId] = useState('');
  const [amount, setAmount] = useState<number | null>(null);
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (currentTransaction) {
      setAccountId(currentTransaction.accountId);
      setAmount(currentTransaction.amount);
      setType(currentTransaction.type);
      setCategory(currentTransaction.category);
      setDate(currentTransaction.date ? currentTransaction.date.split('T')[0] : '');
      setDescription(currentTransaction.description);
    } else {
        resetForm();
    }
  }, [currentTransaction]);

  const resetForm = () => {
    setAccountId('');
    setAmount(null);
    setType('');
    setCategory('');
    setDate(null);
    setDescription('');
  };

  const handleSave = () => {
    console.log('Attempting to save transaction');
    if (accountId && amount !== null && type && category && date) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
      const fullDateTime = `${date}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;

      const finalDescription = description.trim() === '' ? 'N/A' : description;

      console.log('Final description:', finalDescription);

      if (currentTransaction?.id) {
        // edit transaction
        dispatch(updateTransaction({
          id: currentTransaction.id,
          accountId,
          amount,
          type,
          category,
          date: fullDateTime,
          description: finalDescription,
        }));
      } else {
        // add transaction
        dispatch(createTransaction({
          accountId,
          amount,
          type,
          category,
          date: fullDateTime,
          description: finalDescription,
        }));
      }
      onClose();
      dispatch(setCurrentTransaction(null)); 
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{currentTransaction ? 'Edit Transaction' : 'Add New Transaction'}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel>Account</InputLabel>
          <Select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value as string)}
            required
          >
            {accounts.map(account => (
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
        <FormControl fullWidth margin="dense">
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value as string)}
            required
          >
            <MenuItem value="Grocery">Grocery</MenuItem>
            <MenuItem value="Restaurant">Restaurant</MenuItem>
            <MenuItem value="Transport">Transport</MenuItem>
            <MenuItem value="Utilities">Utilities</MenuItem>
            <MenuItem value="Entertainment">Entertainment</MenuItem>
            <MenuItem value="Shopping">Shopping</MenuItem>
            <MenuItem value="Travel">Travel</MenuItem>
            <MenuItem value="Salary">Salary</MenuItem>
            <MenuItem value="Investment">Investment</MenuItem>
            <MenuItem value="Bonus">Bonus</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={date || ''}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" disabled={!accountId || amount === null || !type || !category || !date }>
          {currentTransaction ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTransactionDialog;
