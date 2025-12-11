import { Router } from 'express';
import ProductController from './product.controller';
import { catchAsync } from '../../error-handlers/catchAsync';
import {
  authenticate,
  authorizeAdmin,
} from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { productService } from '../../container';
import {
  createProductSchema,
  updateProductSchema,
  bulkPriceUpdateSchema,
  getProductsQuerySchema,
  productIdSchema,
} from '../../shared/schemas/product.schema';

const router = Router();
const productController = new ProductController(productService);

router.get(
  '/',
  validate(getProductsQuerySchema, 'query'),
  catchAsync(productController.getProducts)
);

router.post(
  '/',
  authenticate,
  authorizeAdmin,
  validate(createProductSchema, 'body'),
  catchAsync(productController.createProduct)
);

router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  validate(productIdSchema, 'params'),
  validate(updateProductSchema, 'body'),
  catchAsync(productController.updateProduct)
);

router.delete(
  '/:id',
  authenticate,
  authorizeAdmin,
  validate(productIdSchema, 'params'),
  catchAsync(productController.deleteProduct)
);

router.post(
  '/bulk-price-update',
  authenticate,
  authorizeAdmin,
  validate(bulkPriceUpdateSchema, 'body'),
  catchAsync(productController.bulkPriceUpdate)
);

export default router;
