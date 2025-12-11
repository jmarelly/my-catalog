import { Grid, Typography, Box } from '@mui/material';
import { useCallback } from 'react';
import { ProductCard } from './ProductCard';
import type { ProductGridProps } from './types';
import type { Product } from '../../types';

export function ProductGrid({ products, onProductClick }: ProductGridProps) {
  const handleProductClick = useCallback(
    (product: Product) => {
      onProductClick?.(product);
    },
    [onProductClick]
  );
  if (products.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography color="text.secondary">No products found</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {products.map(product => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
          <ProductCard
            product={product}
            onClick={() => handleProductClick(product)}
          />
        </Grid>
      ))}
    </Grid>
  );
}
