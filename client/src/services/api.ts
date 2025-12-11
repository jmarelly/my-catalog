import axios from 'axios';
import type {
  Product,
  Category,
  User,
  PaginatedResponse,
  ProductsQuery,
  CreateProduct,
  UpdateProduct,
  BulkPriceUpdate,
  LoginCredentials,
  AuthResponse,
} from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  withCredentials: true,
});

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  me: async (): Promise<User> => {
    const { data } = await api.get('/auth/me');
    return data;
  },
};

export const productsApi = {
  getAll: async (
    query?: ProductsQuery
  ): Promise<PaginatedResponse<Product>> => {
    const { data } = await api.get('/products', { params: query });
    return data;
  },

  create: async (product: CreateProduct): Promise<Product> => {
    const { data } = await api.post('/products', product);
    return data;
  },

  update: async (id: string, product: UpdateProduct): Promise<Product> => {
    const { data } = await api.put(`/products/${id}`, product);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  bulkPriceUpdate: async (
    payload: BulkPriceUpdate
  ): Promise<{ message: string; data: Product[] }> => {
    const { data } = await api.post('/products/bulk-price-update', payload);
    return data;
  },
};

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get('/categories');
    return data;
  },
};

export default api;
