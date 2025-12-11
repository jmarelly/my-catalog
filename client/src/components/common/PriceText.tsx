import { Typography } from '@mui/material';
import type { PriceTextProps } from './types';

const sizeStyles = {
  small: { fontSize: '1rem', fontWeight: 600 },
  medium: { fontSize: '1.75rem', fontWeight: 700 },
  large: { fontSize: '2rem', fontWeight: 700 },
};

export function PriceText({
  price,
  size = 'medium',
  ...props
}: PriceTextProps) {
  return (
    <Typography color="primary" sx={sizeStyles[size]} {...props}>
      ${price.toFixed(2)}
    </Typography>
  );
}
