import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { HttpStatus } from '../constants/HttpStatus';
import { ERROR_MESSAGE_TO_STATUS } from '../constants/errorMessages';

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
    if (ERROR_MESSAGE_TO_STATUS[message]) {
      statusCode = ERROR_MESSAGE_TO_STATUS[message];
    }
  }

  console.error(`[Error] ${req.method} ${req.path} - ${message}`);
  if (!(err instanceof AppError)) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    status: 'error',
    message,
  });
};


