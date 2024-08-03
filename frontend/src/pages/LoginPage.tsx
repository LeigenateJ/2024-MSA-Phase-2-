// LoginPage.tsx
import React from 'react';
import { Container, Grid, Typography, Paper, Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';

const LoginPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  return (
    <Container maxWidth={isMobile ? 'xs' : 'sm'}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        p={isMobile ? 2 : 5}
      >
        <Paper elevation={6} sx={{ width: '100%', p: 4, borderRadius: 2 }}>
          <Grid container spacing={2} direction="column" alignItems="center">
            <Grid item>
              <Typography variant="h4" component="h1" gutterBottom>
                Welcome Back
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" color="textSecondary">
                Please log in to your account
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ width: '100%' }}>
              <LoginForm />
            </Grid>
            <Grid item xs={12} sx={{ width: '100%' }}>
              <Grid container direction={isMobile ? "column" : "row"} alignItems="center" justifyContent={isMobile ? "center" : "space-between"}>
                <Grid item>
                  <Typography variant="body2" color="textSecondary">
                    Don't have an account?
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    variant="text"
                    onClick={() => navigate('/register')}
                  >
                    Register Here
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
