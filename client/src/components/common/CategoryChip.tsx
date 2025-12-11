import { Chip } from '@mui/material';
import { LocalOffer } from '@mui/icons-material';
import type { CategoryChipProps } from './types';

export function CategoryChip({
  name,
  showIcon = false,
  size = 'small',
  color,
}: CategoryChipProps) {
  return (
    <Chip
      icon={showIcon ? <LocalOffer sx={{ fontSize: 14 }} /> : undefined}
      label={name || 'Uncategorized'}
      size={size}
      color={color}
      sx={{ textTransform: 'capitalize' }}
    />
  );
}
