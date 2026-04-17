import { HttpStatus } from '../constants/HttpStatus';
import { AppError } from './AppError';

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
