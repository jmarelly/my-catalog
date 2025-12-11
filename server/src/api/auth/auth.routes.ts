import { Router } from 'express';
import AuthController from './auth.controller';
import { catchAsync } from '../../error-handlers/catchAsync';
import { authenticate } from '../../middlewares/auth.middleware';
import { authLimiter } from '../../middlewares/rateLimiter.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { userService } from '../../container';
import { loginSchema } from '../../shared/schemas/auth.schema';

const router = Router();
const authController = new AuthController(userService);

router.post(
  '/login',
  authLimiter,
  validate(loginSchema, 'body'),
  catchAsync(authController.login)
);

router.post('/logout', catchAsync(authController.logout));

router.get('/me', authenticate, catchAsync(authController.me));

export default router;
