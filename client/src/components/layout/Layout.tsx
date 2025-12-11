import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { Header } from './Header';

export function Layout() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
