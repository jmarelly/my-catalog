import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().max(500, "Description too long").optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const categoryIdSchema = z.object({
  id: z.string().uuid("Invalid category ID"),
});
