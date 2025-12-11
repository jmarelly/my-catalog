import express from 'express';
import authRoutes from '../api/auth/auth.routes';
import productRoutes from '../api/products/product.routes';
import categoryRoutes from '../api/categories/category.routes';

export const router = express();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use('/v1/auth', authRoutes);
router.use('/v1/products', productRoutes);
router.use('/v1/categories', categoryRoutes);
