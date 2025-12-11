import type { Product, CreateProduct } from '../../types';

export interface ProductCheckboxProps {
  product: Product;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export type ProductFormData = {
  name: string;
  price: string;
  categoryId: string;
  description: string;
};

export type ProductFormDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProduct) => void;
  product?: Product | null;
};
