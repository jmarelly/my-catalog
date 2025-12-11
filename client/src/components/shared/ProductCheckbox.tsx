import { memo } from 'react';
import { FormControlLabel, Checkbox } from '@mui/material';
import type { ProductCheckboxProps } from './types';

export const ProductCheckbox = memo<ProductCheckboxProps>(
  ({ product, isSelected, onToggle }) => (
    <FormControlLabel
      control={
        <Checkbox
          checked={isSelected}
          onChange={() => onToggle(product.id)}
          size="small"
        />
      }
      label={`${product.name} - $${product.price.toFixed(2)}`}
      sx={{ '& .MuiTypography-root': { fontSize: '0.875rem' } }}
    />
  )
);

ProductCheckbox.displayName = 'ProductCheckbox';
