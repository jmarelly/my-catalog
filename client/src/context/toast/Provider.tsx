import { useState, useCallback, type ReactNode } from 'react';
import { Snackbar, Alert, type AlertColor } from '@mui/material';
import { ToastContext } from './context';

type Toast = {
  message: string;
  severity: AlertColor;
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback(
    (message: string, severity: AlertColor = 'info') => {
      setToast({ message, severity });
    },
    []
  );

  const success = useCallback(
    (message: string) => showToast(message, 'success'),
    [showToast]
  );
  const error = useCallback(
    (message: string) => showToast(message, 'error'),
    [showToast]
  );

  const handleClose = () => setToast(null);

  return (
    <ToastContext.Provider value={{ showToast, success, error }}>
      {children}
      <Snackbar
        open={!!toast}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={toast?.severity}
          variant="filled"
        >
          {toast?.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}
