import React, { useState, useEffect  } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, Box, List, ListItem, ListItemText, useMediaQuery, useTheme, Divider } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import MenuIcon from '@mui/icons-material/Menu';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ThemeToggle from '../components/common/ThemeToggle';
import { AppDispatch, RootState } from '../redux/store';
import { fetchAccounts } from '../redux/slices/accountSlice';
import { fetchTransactions } from '../redux/slices/transactionSlice';

const drawerWidth = 240;

const DashboardLayout: React.FC<{ darkMode: boolean; toggleDarkMode: () => void }> = ({ darkMode, toggleDarkMode }) => {
  const dispatch: AppDispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user  } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const userId = user?.id;


  useEffect(() => {
    if (isAuthenticated && userId) {
      dispatch(fetchAccounts());
      dispatch(fetchTransactions(userId));
    }
  }, [dispatch, isAuthenticated, userId]);


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      handleDrawerToggle(); // Close the drawer on mobile after navigation
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      {isAuthenticated && (
        <List>
            <ListItem 
                button 
                onClick={() => handleNavigation('/dashboard')}
                sx={{ justifyContent: 'center' }}
            >
                <DashboardIcon sx={{ marginLeft: 3, marginRight: 5 }} />
                <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem 
                button 
                onClick={() => handleNavigation('/accounts')}
                sx={{ justifyContent: 'center' }}
            >
                <AccountBalanceIcon sx={{ marginLeft: 3, marginRight: 5 }} />
                <ListItemText primary="Accounts" />
            </ListItem>
                <ListItem 
                button 
                onClick={() => handleNavigation('/transactions')}
                sx={{ justifyContent: 'center' }}
                >
                <ReceiptIcon sx={{ marginLeft: 3, marginRight: 5 }} />
                <ListItemText primary="Transactions" />
            </ListItem>
        </List>
      )}
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {isAuthenticated && isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Personal Finance Manager
          </Typography>
          <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          {isAuthenticated && (
            <IconButton size="small" color="inherit" onClick={handleLogout}>
              Logout
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      {isAuthenticated && (
        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
          <Drawer
            variant={isMobile ? 'temporary' : 'permanent'}
            open={isMobile ? mobileOpen : true}
            onClose={handleDrawerToggle}
            anchor={isMobile ? 'top' : 'left'}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth,
                maxHeight: isMobile ? '50vh' : 'none', 
                overflow: isMobile ? 'auto' : 'none' 
            },
            }}
          >
            {drawer}
          </Drawer>
          {!isMobile && (
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
              open
            >
              {drawer}
            </Drawer>
          )}
        </Box>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          mt: isAuthenticated ? { xs: 8, sm: 8, md: 10 } : 10,
          paddingX: isAuthenticated ? { xs: 3, sm: 6, md: '5vw' } : { xs: 0, sm: 3, md: '5vw' },
          width: '100%',
          maxHeight: '80vh'
        }}
      >
        {/* <Toolbar /> */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
