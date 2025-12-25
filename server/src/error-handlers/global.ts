import { ErrorRequestHandler, Response } from 'express';
import { config } from '../config';
import { logger } from '../utils/logger';
import { AppError } from '../utils/appError';

const sendErrorDev = (err: AppError, res: Response) => {
  return res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    statusCode: err.statusCode,
    message: err.message,
    err,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    return res.status(err.statusCode || 500).json({
      status: err.status || 'error',
      statusCode: err.statusCode,
      message: err.message,
    });
  }
  return res.status(500).json({
    status: 'Error',
    statusCode: err.statusCode,
    message: 'something went wrong',
  });
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const errorInstance =
    err instanceof AppError ? err : new AppError(err.message);

  const statusCode = errorInstance.statusCode ?? 500;

  if (statusCode >= 500) {
    logger.error(
      { err: errorInstance, url: req.url, method: req.method },
      'Server error'
    );
  } else if (statusCode >= 400) {
    logger.warn({ statusCode, url: req.url }, errorInstance.message);
  }

  if (config.isDevelopment) {
    return sendErrorDev(errorInstance, res);
  }

  return sendErrorProd(err, res);
};
