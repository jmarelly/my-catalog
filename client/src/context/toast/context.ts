import { createContext } from 'react';
import type { AlertColor } from '@mui/material';

export type ToastContextType = {
  showToast: (message: string, severity?: AlertColor) => void;
  success: (message: string) => void;
  error: (message: string) => void;
};

export const ToastContext = createContext<ToastContextType | null>(null);
