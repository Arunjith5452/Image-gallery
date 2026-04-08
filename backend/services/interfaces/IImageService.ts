import { IImage } from '../../models/Image';

export interface IImageService {
  getImages(userId: string): Promise<IImage[]>;
  uploadImages(files: Express.Multer.File[], titlesMap: Record<string, string>, userId: string): Promise<IImage[]>;
  updateImage(id: string, userId: string, title?: string, newFile?: Express.Multer.File): Promise<IImage | null>;
  deleteImage(id: string, userId: string): Promise<void>;
  reorderImages(items: { id: string, order: number }[], userId: string): Promise<void>;
}
