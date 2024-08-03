import React, { useState } from 'react';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { startLoading, setToken, setError } from '../../redux/slices/authSlice';

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated  } = useSelector((state: RootState) => state.auth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(startLoading());
    
    try {
      // Replace with actual login API call
      const token = await fakeLoginApiCall(username, password);
      dispatch(setToken(token));
    } catch (err) {
      dispatch(setError('Login failed'));
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}
        <Box position="relative" width="100%">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ py: 1.5 }}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                color: 'primary.main',
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Box>
      </Box>
    </form>
  );
};

export default LoginForm;

// Mock login API call
const fakeLoginApiCall = (username: string, password: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === 'test' && password === 'password') {
          resolve('fake-jwt-token');
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };