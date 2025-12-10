import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200, "Name too long"),
  price: z.coerce.number().min(0, "Price must be at least $0.01"),
  categoryId: z.string().uuid("Invalid category ID"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(500, "Description too long"),
});

export const updateProductSchema = createProductSchema.partial();

export const bulkPriceUpdateSchema = z.object({
  productIds: z
    .array(z.string().uuid())
    .min(1, "At least one product required"),
  discountPercentage: z
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%"),
});

export const getProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
});

export const productIdSchema = z.object({
  id: z.string().uuid("Invalid product ID"),
});
