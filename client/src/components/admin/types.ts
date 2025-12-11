export type BulkPriceDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    productIds: string[];
    discountPercentage: number;
    onSuccess: () => void;
  }) => void;
};
