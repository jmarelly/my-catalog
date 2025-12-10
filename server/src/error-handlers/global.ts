import { ErrorRequestHandler, Response } from "express";
import { config } from "../config";
import { logger } from "../utils/logger";
import {
  AppError,
  BadError,
  FatalError,
  NotFoundError,
} from "../utils/appError";

const sendErrorDev = (err: AppError, res: Response) => {
  return res.status(err.statusCode || 500).json({
    status: err.status || "error",
    statusCode: err.statusCode,
    message: err.message,
    err,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    return res.status(err.statusCode || 500).json({
      status: err.status || "error",
      statusCode: err.statusCode,
      message: err.message,
    });
  }
  return res.status(500).json({
    status: "Error",
    statusCode: err.statusCode,
    message: "something went wrong",
  });
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let errorInstance: AppError;
  switch (true) {
    case err instanceof NotFoundError:
      errorInstance = new AppError(err.message, 404);
      break;
    case err instanceof BadError:
      errorInstance = new AppError(err.message, 400);
      break;
    case err instanceof FatalError:
      errorInstance = new AppError(err.message, 500);
      break;
    default:
      errorInstance = err;
      break;
  }

  const statusCode = errorInstance.statusCode ?? 500;

  if (statusCode >= 500) {
    logger.error({ err: errorInstance, url: req.url, method: req.method }, "Server error");
  } else if (statusCode >= 400) {
    logger.warn({ statusCode, url: req.url }, errorInstance.message);
  }

  if (config.isDevelopment) {
    return sendErrorDev(errorInstance, res);
  }

  return sendErrorProd(err, res);
};
