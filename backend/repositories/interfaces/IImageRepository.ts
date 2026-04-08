import { IBaseRepository } from './IBaseRepository';
import { IImage } from '../../models/Image';

export interface IImageRepository extends IBaseRepository<IImage> {
  findUserImages(userId: string): Promise<IImage[]>;
  bulkCreate(images: Partial<IImage>[]): Promise<IImage[]>;
  bulkUpdateOrder(items: { id: string, order: number, userId: string }[]): Promise<void>;
  findHighestOrderForUser(userId: string): Promise<number>;
}
