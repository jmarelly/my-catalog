import { useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { Modal } from '../common/Modal';
import { productSchema } from '../../schemas/product.schema';
import { useValidationErrors } from '../../hooks/useValidationErrors';
import { useCategories } from '../../hooks/useProducts';
import type { Product, CreateProduct } from '../../types';
import type { ProductFormDialogProps, ProductFormData } from './types';

export function ProductFormDialog({
  open,
  onClose,
  onSubmit,
  product,
}: ProductFormDialogProps) {
  const [formData, setFormData] = useState<ProductFormData>(() =>
    getInitialFormData(product)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEditing = !!product;
  const { processZodError } = useValidationErrors();
  const { data: categories = [] } = useCategories();

  const resetForm = () => {
    setFormData(getInitialFormData(product));
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = validateAndSubmitForm();
    if (result.success) {
      onSubmit(result.data);
    } else {
      setErrors(result.errors);
    }
  };

  const validateAndSubmitForm = ():
    | { success: true; data: CreateProduct }
    | { success: false; errors: Record<string, string> } => {
    try {
      const validatedData = productSchema.parse({
        name: formData.name,
        price: formData.price,
        categoryId: formData.categoryId,
        description: formData.description,
      });

      return { success: true, data: validatedData };
    } catch (err) {
      const fieldErrors = processZodError(err);
      return {
        success: false,
        errors: fieldErrors || { general: 'An unexpected error occurred' },
      };
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEditing ? 'Edit Product' : 'Add Product'}
      actions={
        <>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="product-form" variant="contained">
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </>
      }
    >
      <Box component="form" id="product-form" onSubmit={handleSubmit}>
        <TextField
          label="Name"
          fullWidth
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          margin="normal"
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          label="Price"
          type="number"
          fullWidth
          value={formData.price}
          onChange={e => setFormData({ ...formData, price: e.target.value })}
          margin="normal"
          slotProps={{ htmlInput: { step: '0.01' } }}
          error={!!errors.price}
          helperText={errors.price}
        />
        <FormControl fullWidth margin="normal" error={!!errors.categoryId}>
          <InputLabel>Category</InputLabel>
          <Select
            value={formData.categoryId}
            label="Category"
            onChange={e =>
              setFormData({ ...formData, categoryId: e.target.value })
            }
          >
            {categories.map(cat => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
          {errors.categoryId && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
              {errors.categoryId}
            </Typography>
          )}
        </FormControl>
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={formData.description}
          onChange={e =>
            setFormData({ ...formData, description: e.target.value })
          }
          margin="normal"
          error={!!errors.description}
          helperText={errors.description}
        />
      </Box>
    </Modal>
  );
}

function getInitialFormData(product?: Product | null): ProductFormData {
  if (product) {
    return {
      name: product.name,
      price: product.price.toString(),
      categoryId: product.categoryId,
      description: product.description,
    };
  }
  return { name: '', price: '', categoryId: '', description: '' };
}
