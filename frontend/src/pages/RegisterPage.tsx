// 
// RegisterPage.tsx
import React from 'react';
import { Container, Paper, Grid, Box, Typography, Button, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/Auth/RegisterForm';

const RegisterPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        p={2}
      >
        <Paper elevation={6} sx={{ width: '100%', p: 4, borderRadius: 2 }}>
          <Grid container spacing={2} direction="column" alignItems="center">
            <Grid item>
              <Typography variant="h4" component="h1" gutterBottom>
                Create an Account
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ width: '100%' }}>
              <RegisterForm />
            </Grid>
            <Grid item xs={12} sx={{ width: '100%' }}>
              <Grid container direction={isMobile ? "column" : "row"} alignItems="center" justifyContent={isMobile ? "center" : "space-between"}>
                <Grid item>
                  <Typography variant="body2" color="textSecondary">
                    Already have an account?
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    variant="text"
                    onClick={() => navigate('/login')}
                  >
                    Login Here
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

export default RegisterPage;
