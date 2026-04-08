import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { Request, Response, NextFunction } from 'express';
import { IAuthService } from '../services/interfaces/IAuthService';
import { HttpStatus } from '../constants/HttpStatus';
import { AppError } from '../utils/AppError';

@injectable()
export class AuthController {
  private authService: IAuthService;

  constructor(@(inject(TYPES.IAuthService) as ParameterDecorator) authService: IAuthService) {
    this.authService = authService;
  }

  registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.authService.register(req.body);
      res.status(HttpStatus.CREATED).json(data);
    } catch (error: any) {
      if (['Please add all fields', 'User already exists', 'Invalid user data'].includes(error.message)) {
        next(new AppError(error.message, HttpStatus.BAD_REQUEST));
      } else {
        next(error);
      }
    }
  };

  loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.authService.login(req.body);
      res.status(HttpStatus.OK).json(data);
    } catch (error: any) {
      if (error.message === 'Invalid credentials') {
        next(new AppError(error.message, HttpStatus.UNAUTHORIZED));
      } else {
        next(error);
      }
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.authService.resetPassword(req.body);
      res.status(HttpStatus.OK).json(data);
    } catch (error: any) {
      if (error.message === 'User not found or phone mismatch') {
        next(new AppError(error.message, HttpStatus.NOT_FOUND));
      } else {
        next(error);
      }
    }
  };
}
