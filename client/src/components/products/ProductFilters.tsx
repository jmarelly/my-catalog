import { useState, useEffect } from 'react';
import { Box, TextField, InputAdornment, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import type { ProductFiltersProps } from './types';

export function ProductFilters({
  onFilterChange,
  totalItems,
}: ProductFiltersProps) {
  const [search, setSearch] = useState('');

  useEffect(() => {
    const debounce = setTimeout(() => {
      onFilterChange({ search });
    }, 300);

    return () => clearTimeout(debounce);
  }, [search, onFilterChange]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        mb: 4,
        alignItems: 'center',
      }}
    >
      <TextField
        placeholder="Search products..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        sx={{ flexGrow: 1, minWidth: 250, backgroundColor: 'white' }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          },
        }}
      />

      <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
        {totalItems} products
      </Typography>
    </Box>
  );
}
