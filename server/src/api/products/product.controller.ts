import { Request, Response } from 'express';
import ProductService from './product.service';
import {
  TGetProductsQuery,
  TCreateProduct,
  TUpdateProduct,
  TBulkPriceUpdate,
} from './product.types';

export default class ProductController {
  constructor(private productService: ProductService) {}

  getProducts = async (req: Request, res: Response) => {
    const query: TGetProductsQuery = req.query;

    const result = await this.productService.getProducts(query);
    return res.status(200).json(result);
  };

  createProduct = async (req: Request, res: Response) => {
    const productData: TCreateProduct = req.body;
    const product = await this.productService.createProduct(productData);
    return res.status(201).json(product);
  };

  updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData: TUpdateProduct = req.body;
    const product = await this.productService.updateProduct(id, updateData);
    return res.status(200).json(product);
  };

  deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.productService.deleteProduct(id);
    return res.status(204).send();
  };

  bulkPriceUpdate = async (req: Request, res: Response) => {
    const { productIds, discountPercentage }: TBulkPriceUpdate = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res
        .status(400)
        .json({ message: 'productIds must be a non-empty array' });
    }

    if (
      discountPercentage === undefined ||
      discountPercentage < 0 ||
      discountPercentage > 100
    ) {
      return res
        .status(400)
        .json({ message: 'discountPercentage must be between 0 and 100' });
    }

    const updatedProducts = await this.productService.bulkPriceUpdate({
      productIds,
      discountPercentage,
    });

    return res.status(200).json({
      message: `Successfully updated ${updatedProducts.length} products`,
      data: updatedProducts,
    });
  };
}
