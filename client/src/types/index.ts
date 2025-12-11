export type User = {
  id: string;
  username: string;
  role: 'admin' | 'customer';
};

export type Category = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  category?: {
    id: string;
    name: string;
  };
};

export type PaginatedResponse<T> = {
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

export type ProductsQuery = {
  page?: number;
  limit?: number;
  search?: string;
};

export type CreateProduct = {
  name: string;
  price: number;
  categoryId: string;
  description: string;
};

export type UpdateProduct = Partial<CreateProduct>;

export type BulkPriceUpdate = {
  productIds: string[];
  discountPercentage: number;
};

export type LoginCredentials = {
  username: string;
  password: string;
};

export type AuthResponse = {
  user: User;
};
