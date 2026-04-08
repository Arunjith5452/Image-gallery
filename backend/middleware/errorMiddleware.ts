import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { HttpStatus } from '../constants/HttpStatus';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  // Log error for development (optional: use a logger like winston)
  console.error(`[Error] ${req.method} ${req.path} - ${message}`);
  if (!(err instanceof AppError)) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    status: 'error',
    message,
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
