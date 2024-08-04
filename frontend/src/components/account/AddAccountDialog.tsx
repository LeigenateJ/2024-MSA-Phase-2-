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
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addAccount } from '../../redux/slices/accountSlice'

interface AddAccountDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddAccountDialog: React.FC<AddAccountDialogProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [balance, setBalance] = useState<number | null>(null);

  const handleAdd = () => {
    if (name && type && balance !== null) {
      dispatch(addAccount({
        id: Math.random().toString(36).substr(2, 9), 
        name,
        type,
        balance,
        userId: 'user1', 
      }));
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Add New Account</DialogTitle>
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
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAdd} color="primary" disabled={!name || !type || balance === null}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAccountDialog;
