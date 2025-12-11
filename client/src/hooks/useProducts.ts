import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi, categoriesApi } from '../services/api';
import { useToast } from './useToast';
import type { CreateProduct } from '../types';

export const useProductsData = (page: number) => {
  const productsData = useQuery({
    queryKey: ['products', 'admin', page],
    queryFn: () => productsApi.getAll({ page, limit: 8 }),
  });

  const allProductsData = useQuery({
    queryKey: ['products', 'all'],
    queryFn: () => productsApi.getAll(),
  });

  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  return { productsData, allProductsData, categories };
};

export const useProductMutations = (callbacks?: {
  onBulkUpdateSuccess?: () => void;
  onCreateSuccess?: () => void;
  onUpdateSuccess?: () => void;
  onDeleteSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const createMutation = useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully');
      callbacks?.onCreateSuccess?.();
    },
    onError: () => {
      toast.error('Failed to create product');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateProduct }) =>
      productsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
      callbacks?.onUpdateSuccess?.();
    },
    onError: () => {
      toast.error('Failed to update product');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
      callbacks?.onDeleteSuccess?.();
    },
    onError: () => {
      toast.error('Failed to delete product');
    },
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: productsApi.bulkPriceUpdate,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      callbacks?.onBulkUpdateSuccess?.();
      toast.success(
        `Updated prices for ${variables.productIds.length} products`
      );
    },
    onError: () => {
      toast.error('Failed to update prices');
    },
  });

  return { createMutation, updateMutation, deleteMutation, bulkUpdateMutation };
};
