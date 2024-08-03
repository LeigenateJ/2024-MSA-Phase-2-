import React from 'react';
import { Container, Grid, Typography } from '@mui/material';
import LoginForm from './LoginForm';

const AuthWrapper: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom align="center">
            Login
          </Typography>
          <LoginForm />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AuthWrapper;
