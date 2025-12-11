import { CardContent, Typography, Box } from "@mui/material";
import { memo } from "react";
import { StyledCard } from "./ProductCard.styles";
import { CategoryChip } from "../common/CategoryChip";
import { PriceText } from "../common/PriceText";
import type { ProductCardProps } from "./types";

function ProductCardComponent({ product, onClick }: ProductCardProps) {
  return (
    <StyledCard onClick={onClick}>
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Box sx={{ alignSelf: "flex-start", mb: 2 }}>
          <CategoryChip name={product.category?.name} showIcon />
        </Box>

        <Typography variant="h6" gutterBottom fontWeight={600}>
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            flexGrow: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {product.description}
        </Typography>

        <Box sx={{ mt: "auto" }}>
          <PriceText price={product.price} />
        </Box>
      </CardContent>
    </StyledCard>
  );
}

export const ProductCard = memo(ProductCardComponent);
