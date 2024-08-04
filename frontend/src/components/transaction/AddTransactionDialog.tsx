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
import { RootState } from '../../redux/store';
import { addTransaction, updateTransaction, setCurrentTransaction } from '../../redux/slices/transactionSlice';

interface AddTransactionDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
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
      setDate(currentTransaction.date.split('T')[0]); // 仅设置日期部分
      setDescription(currentTransaction.description);
    } else {
      // 如果没有初始数据，则清空表单
      setAccountId('');
      setAmount(null);
      setType('');
      setCategory('');
      setDate(null);
      setDescription('');
    }
  }, [currentTransaction]);

  const handleSave = () => {
    if (accountId && amount !== null && type && category && date && description) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
      const fullDateTime = `${date}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;

      if (currentTransaction?.id) {
        // 编辑交易
        dispatch(updateTransaction({
          id: currentTransaction.id,
          accountId,
          amount,
          type,
          category,
          date: fullDateTime,
          description,
        }));
      } else {
        // 新增交易
        dispatch(addTransaction({
          id: Math.random().toString(36).substr(2, 9),
          accountId,
          amount,
          type,
          category,
          date: fullDateTime,
          description,
        }));
      }
      onClose();
      dispatch(setCurrentTransaction(null)); // 关闭对话框后重置当前交易
    }
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
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" disabled={!accountId || amount === null || !type || !category || !date || !description}>
          {currentTransaction ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTransactionDialog;
