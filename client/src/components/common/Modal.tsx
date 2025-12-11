import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import type { ModalProps } from './types';

export function Modal({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
}: ModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      slotProps={{
        paper: {
          sx: { bgcolor: 'background.paper' },
        },
      }}
    >
      {title && (
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {title}
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
      )}
      <DialogContent>{children}</DialogContent>
      {actions && (
        <DialogActions sx={{ px: 3, pb: 2 }}>{actions}</DialogActions>
      )}
    </Dialog>
  );
}
