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
import { addAccount, updateAccount } from '../../redux/slices/accountSlice';
import { AppDispatch, RootState } from '../../redux/store';

interface AddAccountDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddAccountDialog: React.FC<AddAccountDialogProps> = ({ open, onClose }) => {
    const dispatch: AppDispatch = useDispatch();
  const { currentAccount } = useSelector((state: RootState) => state.accounts);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (currentAccount) {
      setName(currentAccount.name);
      setType(currentAccount.type);
      setBalance(currentAccount.balance);
    } else {
        resetForm();
    }
  }, [currentAccount]);

  const resetForm = () => {
    setName('');
    setType('');
    setBalance(null);
  };

  const handleAddOrUpdate = () => {
    if (name && type && balance !== null) {
      if (currentAccount) {
        // update account
        const newAccount = {
          id: currentAccount.id,
          name,
          type,
          balance,
          userId: user?.id || '',
        };
        dispatch(updateAccount(newAccount));
      } else {
        // add account, remove id
        const newAccount = {
          name,
          type,
          balance,
          userId: user?.id || '',
        };
        dispatch(addAccount(newAccount));
      }
      resetForm();
      onClose();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        {currentAccount ? 'Edit Account' : 'Add New Account'}
      </DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Account Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Account Type</InputLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as string)}
            required
          >
            <MenuItem value="Checking">Checking</MenuItem>
            <MenuItem value="Savings">Savings</MenuItem>
            <MenuItem value="Credit">Credit</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Initial Balance"
          type="number"
          fullWidth
          value={balance !== null ? balance : ''}
          onChange={(e) => setBalance(parseFloat(e.target.value))}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAddOrUpdate} color="primary" disabled={!name || !type || balance === null}>
          {currentAccount ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAccountDialog;
