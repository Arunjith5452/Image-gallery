import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { Request, Response, NextFunction } from 'express';
import { IImageService } from '../services/interfaces/IImageService';
import { HttpStatus } from '../constants/HttpStatus';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../middleware/auth';

@injectable()
export class ImageController {
  private imageService: IImageService;

  constructor(@(inject(TYPES.IImageService) as ParameterDecorator) imageService: IImageService) {
    this.imageService = imageService;
  }

  getImages = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const images = await this.imageService.getImages(req.user?.id as string);
      res.status(HttpStatus.OK).json(images);
    } catch (error: any) {
      next(error);
    }
  };

  uploadImages = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      let titlesMap: Record<string, string> = {};
      if (req.body.titles) {
        try {
          titlesMap = JSON.parse(req.body.titles);
        } catch (e) {
          console.error("Could not parse titles", e);
        }
      }

      const files = req.files as Express.Multer.File[];
      const createdImages = await this.imageService.uploadImages(files, titlesMap, req.user?.id as string);
      res.status(HttpStatus.CREATED).json(createdImages);
    } catch (error: any) {
      if (error.message === 'No images provided') {
         next(new AppError(error.message, HttpStatus.BAD_REQUEST));
      } else {
         next(error);
      }
    }
  };

  updateImage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updatedImage = await this.imageService.updateImage(
        req.params.id as string,
        req.user?.id as string,
        req.body.title,
        req.file
      );
      res.status(HttpStatus.OK).json(updatedImage);
    } catch (error: any) {
      if (error.message === 'Image not found') {
        next(new AppError(error.message, HttpStatus.NOT_FOUND));
      } else if (error.message === 'User not authorized') {
        next(new AppError(error.message, HttpStatus.UNAUTHORIZED));
      } else {
        next(error);
      }
    }
  };

  deleteImage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.imageService.deleteImage(req.params.id as string, req.user?.id as string);
      res.status(HttpStatus.OK).json({ id: req.params.id });
    } catch (error: any) {
      if (error.message === 'Image not found') {
        next(new AppError(error.message, HttpStatus.NOT_FOUND));
      } else if (error.message === 'User not authorized') {
        next(new AppError(error.message, HttpStatus.UNAUTHORIZED));
      } else {
        next(error);
      }
    }
  };

  reorderImages = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.imageService.reorderImages(req.body.items, req.user?.id as string);
      res.status(HttpStatus.OK).json({ message: 'Images reordered successfully' });
    } catch (error: any) {
      if (error.message === 'No items provided for reordering') {
         next(new AppError(error.message, HttpStatus.BAD_REQUEST));
      } else {
         next(error);
      }
    }
  };
}
