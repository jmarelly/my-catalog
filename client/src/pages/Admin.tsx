import { useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
} from '@mui/material';
import { Add, Edit, Delete, Percent } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useProductsData, useProductMutations } from '../hooks/useProducts';
import { Pagination } from '../components/common/Pagination';
import { PageHeader } from '../components/common/PageHeader';
import { CategoryChip } from '../components/common/CategoryChip';
import { PriceText } from '../components/common/PriceText';
import { ProductFormDialog } from '../components/shared/ProductFormDialog';
import { BulkPriceDialog } from '../components/admin/BulkPriceDialog';
import { ProductFilters } from '../components/products/ProductFilters';
import type { Product, CreateProduct, ProductsQuery } from '../types';

export function Admin() {
  const { isAdmin, isLoading: authLoading } = useAuth();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [filters, setFilters] = useState<ProductsQuery>({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { productsData } = useProductsData(page, filters, limit);
  const { createMutation, updateMutation, deleteMutation, bulkUpdateMutation } =
    useProductMutations({
      onBulkUpdateSuccess: () => {
        setIsBulkOpen(false);
      },
      onCreateSuccess: () => {
        setIsCreateOpen(false);
        setEditingProduct(null);
      },
      onUpdateSuccess: () => setEditingProduct(null),
    });

  const handleFilterChange = useCallback((newFilters: ProductsQuery) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const handleProductSubmit = useCallback(
    (data: CreateProduct) => {
      if (editingProduct) {
        updateMutation.mutate({ id: editingProduct.id, data });
      } else {
        createMutation.mutate(data);
      }
    },
    [editingProduct, updateMutation, createMutation]
  );

  const handleBulkSubmit = useCallback(
    (data: {
      productIds: string[];
      discountPercentage: number;
      onSuccess?: () => void;
    }) => {
      bulkUpdateMutation.mutate(data, {
        onSuccess: () => {
          data.onSuccess?.();
        },
      });
    },
    [bulkUpdateMutation]
  );

  if (authLoading) return null;

  if (!isAdmin) return <Navigate to="/" replace />;

  const products = productsData?.data?.data || [];

  return (
    <>
      <PageHeader
        title="Admin Panel"
        actions={
          <>
            <Button
              variant="outlined"
              startIcon={<Percent />}
              onClick={() => setIsBulkOpen(true)}
            >
              Bulk Discount
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setIsCreateOpen(true)}
            >
              Add Product
            </Button>
          </>
        }
      />

      <Box sx={{ mb: 3 }}>
        <ProductFilters
          onFilterChange={handleFilterChange}
          onLimitChange={handleLimitChange}
          totalItems={productsData?.data?.pagination.totalItems || 0}
          currentLimit={limit}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map(product => (
              <TableRow key={product.id} hover>
                <TableCell>
                  <Typography fontWeight={500}>{product.name}</Typography>
                </TableCell>
                <TableCell>
                  <CategoryChip name={product.category?.name} />
                </TableCell>
                <TableCell>
                  <PriceText price={product.price} size="small" />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => setEditingProduct(product)}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => deleteMutation.mutate(product.id)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {productsData && (
        <Pagination
          currentPage={productsData?.data?.pagination.currentPage || 1}
          totalPages={productsData?.data?.pagination.totalPages || 1}
          onPageChange={setPage}
        />
      )}

      {(isCreateOpen || !!editingProduct) && (
        <ProductFormDialog
          key={editingProduct?.id || 'new'}
          open={true}
          onClose={() => {
            setIsCreateOpen(false);
            setEditingProduct(null);
          }}
          onSubmit={handleProductSubmit}
          product={editingProduct}
        />
      )}

      {isBulkOpen && (
        <BulkPriceDialog
          open={true}
          onClose={() => setIsBulkOpen(false)}
          onSubmit={handleBulkSubmit}
        />
      )}
    </>
  );
}
