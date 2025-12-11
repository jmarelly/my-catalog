import { Link, useNavigate } from 'react-router-dom';
import { Toolbar, Typography, Button, Box, Chip } from '@mui/material';
import { Login as LoginIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { StyledAppBar, Logo } from './Header.styles';
import StoreIcon from '@mui/icons-material/Store';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';

export function Header() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <StyledAppBar position="sticky" elevation={0}>
      <Toolbar sx={{ maxWidth: 1400, width: '100%', mx: 'auto', px: 3 }}>
        <Logo to="/">
          <HomeIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" fontWeight={700}>
            Strauss
          </Typography>
        </Logo>
        <Button
          component={Link}
          to="/"
          color="inherit"
          startIcon={<StoreIcon />}
          size="small"
          sx={{ ml: 3 }}
        >
          Catalog
        </Button>

        {user && isAdmin && (
          <Button
            component={Link}
            to="/admin"
            color="inherit"
            startIcon={<DashboardIcon />}
            size="small"
            sx={{ ml: 3 }}
          >
            Admin Panel
          </Button>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user ? (
            <>
              <Chip
                label={`Hello ${user.username}!`}
                size="small"
                sx={{ bgcolor: 'background.paper' }}
              />
              <Button
                onClick={handleLogout}
                color="inherit"
                startIcon={<LogoutIcon />}
                size="small"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              component={Link}
              to="/login"
              variant="contained"
              startIcon={<LoginIcon />}
              size="small"
            >
              Admin Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}
