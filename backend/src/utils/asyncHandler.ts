import { Request, Response, NextFunction } from 'express';

/**
 * Wraps async route handlers to automatically forward errors to next().
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
