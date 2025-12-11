import { Card } from '@mui/material';
import styled from 'styled-components';

export const StyledCard = styled(Card)`
  cursor: pointer;
  transition: all 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    border-color: #6366f1 !important;
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.25);
  }
`;
