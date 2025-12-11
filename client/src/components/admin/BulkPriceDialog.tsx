import { useState, useCallback, memo } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Autocomplete,
  Checkbox,
  Chip,
} from "@mui/material";
import { CheckBoxOutlineBlank, CheckBox } from "@mui/icons-material";
import { Modal } from "../common/Modal";
import { bulkPriceUpdateSchema } from "../../schemas/product.schema";
import { ZodError } from "zod";
import type { BulkPriceDialogProps } from "./types";
import type { Product } from "../../types";

function BulkPriceDialogComponent({
  open,
  onClose,
  onSubmit,
  products,
}: BulkPriceDialogProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [discount, setDiscount] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});

      try {
        const validated = bulkPriceUpdateSchema.parse({
          productIds: Array.from(selectedIds),
          discountPercentage: discount,
        });

        onSubmit({
          productIds: validated.productIds,
          discountPercentage: validated.discountPercentage,
          onSuccess: () => {
            onClose();
            setSelectedIds(new Set());
            setDiscount("");
            setErrors({});
          },
        });
      } catch (err) {
        if (err instanceof ZodError) {
          const fieldErrors: Record<string, string> = {};
          err.issues.forEach((issue) => {
            const field = issue.path[0] as string;
            fieldErrors[field] = issue.message;
          });
          setErrors(fieldErrors);
        }
      }
    },
    [selectedIds, discount, onSubmit, onClose]
  );

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSelection = useCallback(
    (_event: React.SyntheticEvent, newValue: Product[]) => {
      const newSelectedIds = new Set(
        newValue.map((product: Product) => product.id)
      );
      setSelectedIds(newSelectedIds);
      // Clear validation error when user starts selecting products
      if (errors.productIds) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.productIds;
          return newErrors;
        });
      }
    },
    [errors.productIds]
  );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Bulk Discount"
      actions={
        <>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="bulk-form" variant="contained">
            Apply Discount
          </Button>
        </>
      }
    >
      <Box component="form" id="bulk-form" onSubmit={handleSubmit}>
        <TextField
          label="Discount Percentage"
          type="number"
          fullWidth
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          margin="normal"
          placeholder="e.g., 10 for 10% off"
          error={!!errors.discountPercentage}
          helperText={errors.discountPercentage}
        />

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Select Products ({selectedIds.size} selected)
        </Typography>

        <Autocomplete
          multiple
          options={products}
          value={products.filter((product) => selectedIds.has(product.id))}
          onChange={handleSelection}
          getOptionLabel={(product) =>
            `${product.name} - $${product.price.toFixed(2)}`
          }
          renderOption={(props, product, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={<CheckBoxOutlineBlank fontSize="small" />}
                checkedIcon={<CheckBox fontSize="small" />}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {product.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {product.description} • ${product.price.toFixed(2)}
                </Typography>
              </Box>
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((product, index) => (
              <Chip
                {...getTagProps({ index })}
                key={product.id}
                label={product.name}
                size="small"
                onDelete={() => {
                  const newSelectedIds = new Set(selectedIds);
                  newSelectedIds.delete(product.id);
                  setSelectedIds(newSelectedIds);
                }}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search and select products..."
              error={!!errors.productIds}
              helperText={errors.productIds}
            />
          )}
          sx={{ mb: 2 }}
          limitTags={3}
          disableCloseOnSelect
          componentsProps={{
            popper: {
              sx: {
                "& .MuiAutocomplete-listbox": {
                  "& .MuiAutocomplete-option": {
                    padding: "8px 16px",
                  },
                },
              },
            },
          }}
        />
      </Box>
    </Modal>
  );
}

export const BulkPriceDialog = memo(BulkPriceDialogComponent);
