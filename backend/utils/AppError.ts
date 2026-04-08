import { HttpStatus } from '../constants/HttpStatus';

export class AppError extends Error {
  public readonly statusCode: HttpStatus;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
