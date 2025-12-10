import { Product } from "./product.schema";

export type TCreateProduct = {
  name: string;
  price: number;
  categoryId: string;
  description: string;
};

export type TUpdateProduct = Partial<TCreateProduct>;

export type TGetProductsQuery = {
  page?: number;
  limit?: number;
  search?: string;
};

export type TProductWithCategory = Product & {
  category?: { id: string; name: string };
};

export type TPaginatedResponse<T> = {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export type TBulkPriceUpdate = {
  productIds: string[];
  discountPercentage: number;
};
