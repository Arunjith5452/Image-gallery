import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { AppError } from '../utils/AppError';
import { HttpStatus } from '../constants/HttpStatus';

export const validateDto = (dtoClass: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req.body);
    validate(dtoInstance, { whitelist: true, forbidNonWhitelisted: true }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors
            .map((error: ValidationError) => Object.values(error.constraints || {}))
            .flat()
            .join(', ');
          next(new AppError(message, HttpStatus.BAD_REQUEST));
        } else {
          req.body = dtoInstance;
          next();
        }
      }
    );
  };
};
