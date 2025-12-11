import { Link } from 'react-router-dom';
import { AppBar } from '@mui/material';
import styled from 'styled-components';

export const StyledAppBar = styled(AppBar)`
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #e2e8f0;
`;

export const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1e293b;
  text-decoration: none;
`;
