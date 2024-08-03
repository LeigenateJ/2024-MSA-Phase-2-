import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';

interface AddAccountDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (account: { name: string; type: string; balance: number }) => void;
}

const AddAccountDialog: React.FC<AddAccountDialogProps> = ({ open, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [balance, setBalance] = useState<number | null>(null);

  const handleAdd = () => {
    if (name && type && balance !== null) {
      onAdd({ name, type, balance });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Add New Account</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Account Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          select
          margin="dense"
          label="Account Type"
          fullWidth
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <MenuItem value="Checking">Checking</MenuItem>
          <MenuItem value="Savings">Savings</MenuItem>
          <MenuItem value="Credit">Credit</MenuItem>
        </TextField>
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
