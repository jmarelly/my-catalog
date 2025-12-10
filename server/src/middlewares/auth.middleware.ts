import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError";
import { config } from "../config";
import { AuthRequest } from "../api/auth/auth.types";
import { userModel } from "../container";

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      throw new AppError("Not authenticated", 401);
    }

    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: string;
      role: string;
    };

    const user = userModel.findById(decoded.id);

    if (!user) {
      throw new AppError("User not found", 401);
    }

    req.user = {
      id: user.id,
      username: user.username,
      role: user.role as "admin" | "customer",
    };
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Invalid token", 401));
    }
    next(error);
  }
};

export const authorizeAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== "admin") {
    return next(new AppError("Admin access required", 403));
  }
  next();
};
