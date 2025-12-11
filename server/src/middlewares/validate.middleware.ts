import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../utils/appError';

export const validate = (
  schema: ZodSchema,
  source: 'body' | 'query' | 'params' = 'body'
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate =
        source === 'body'
          ? req.body
          : source === 'query'
            ? req.query
            : req.params;
      const validated = await schema.parseAsync(dataToValidate);

      if (source === 'body') {
        req.body = validated;
      } else if (source === 'query') {
        req.query = validated as any;
      } else {
        req.params = validated as any;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.issues
          .map(issue => `${issue.path.join('.')}: ${issue.message}`)
          .join(', ');
        return next(new AppError(`Validation error: ${messages}`, 400));
      }
      next(error);
    }
  };
};
