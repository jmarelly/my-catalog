import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Typography, Alert } from "@mui/material";
import { productsApi } from "../services/api";
import { ProductGrid } from "../components/products/ProductGrid";
import { ProductFilters } from "../components/products/ProductFilters";
import { Pagination } from "../components/common/Pagination";
import { Modal } from "../components/common/Modal";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { CategoryChip } from "../components/common/CategoryChip";
import { PriceText } from "../components/common/PriceText";
import type { Product, ProductsQuery } from "../types";
import { GradientTitle } from "./Home.styles";

export function Home() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ProductsQuery>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const normalizedFilters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) => value !== "" && value !== undefined
        )
      ),
    [filters]
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", page, normalizedFilters],
    queryFn: () => productsApi.getAll({ ...filters, page, limit: 8 }),
  });

  const handleFilterChange = useCallback((newFilters: ProductsQuery) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        Error loading products. Please try again.
      </Alert>
    );
  }

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <GradientTitle variant="h1" gutterBottom>
          Product Catalog
        </GradientTitle>
        <Typography variant="h6" color="text.secondary">
          Welcome to the new Strauss marketplace
        </Typography>
      </Box>

      <ProductFilters
        onFilterChange={handleFilterChange}
        totalItems={data?.pagination.totalItems || 0}
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <ProductGrid
            products={data?.data || []}
            onProductClick={setSelectedProduct}
          />

          {data && (
            <Pagination
              currentPage={data.pagination.currentPage}
              totalPages={data.pagination.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      <Modal
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.name}
      >
        {selectedProduct && (
          <>
            <CategoryChip
              name={selectedProduct.category?.name}
              color="primary"
            />
            <PriceText
              price={selectedProduct.price}
              size="large"
              sx={{ my: 2 }}
            />
            <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {selectedProduct.description}
            </Typography>
          </>
        )}
      </Modal>
    </>
  );
}
