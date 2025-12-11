import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { router } from './routes';
import { AppError } from './utils/appError';
import { errorHandler as globalErrorHandler } from './error-handlers/global';
import { globalLimiter } from './middlewares/rateLimiter.middleware';

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

app.use(globalLimiter);

app.use('/api', router);

app.all('*', (req, res, next) => {
  next(new AppError(`Failed to load endpoint: ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

export { app };
