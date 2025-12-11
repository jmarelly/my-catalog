import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200, 'Name too long'),
  price: z
    .string()
    .trim()
    .min(1, 'Price is required')
    .transform(val => parseFloat(val)),
  categoryId: z.string().trim().min(1, 'Category is required'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description too long'),
});

export const bulkPriceUpdateSchema = z.object({
  productIds: z.array(z.string()).min(1, 'Select at least one product'),
  discountPercentage: z
    .string()
    .trim()
    .min(1, 'Discount must be a valid percentage between 0 and 100')
    .transform(val => parseFloat(val)),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type BulkPriceUpdateData = z.infer<typeof bulkPriceUpdateSchema>;
