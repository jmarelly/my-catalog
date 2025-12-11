import type { ChipProps, DialogProps } from '@mui/material';
import type { TypographyProps } from '@mui/material';
import type { ReactNode } from 'react';

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: DialogProps['maxWidth'];
  fullWidth?: boolean;
};

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export type PriceTextProps = {
  price: number;
  size?: 'small' | 'medium' | 'large';
} & Omit<TypographyProps, 'children'>;

export type CategoryChipProps = {
  name: string | undefined;
  showIcon?: boolean;
  size?: ChipProps['size'];
  color?: ChipProps['color'];
};

export type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};
