import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  // Log the error with a timestamp
  console.error(`[${new Date().toISOString()}] `, err);

  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred.';
  const details = err.details || {};
  const status = err.status || 500;

  res.status(status).json({
    code,
    message,
    details,
  });
}
