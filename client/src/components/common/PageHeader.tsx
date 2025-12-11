import { Box, Typography } from '@mui/material';
import type { PageHeaderProps } from './types';

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        mb: 4,
      }}
    >
      <Box>
        <Typography variant="h3" fontWeight={700}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="h6" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && <Box sx={{ display: 'flex', gap: 2 }}>{actions}</Box>}
    </Box>
  );
}
