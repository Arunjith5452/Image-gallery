import { injectable } from 'inversify';
import { BaseRepository } from './BaseRepository';
import { IImageRepository } from './interfaces/IImageRepository';
import Image, { IImage } from '../models/Image';

@injectable()
export class ImageRepository extends BaseRepository<IImage> implements IImageRepository {
  protected _model = Image;

  async findUserImages(userId: string): Promise<IImage[]> {
    return this._model.find({ user: userId }).sort({ order: 1, createdAt: -1 }).exec();
  }

  async bulkCreate(imagesList: Partial<IImage>[]): Promise<IImage[]> {
    return this._model.insertMany(imagesList) as unknown as IImage[];
  }

  async bulkUpdateOrder(reorderItems: { id: string; order: number; userId: string }[]): Promise<void> {
    const bulkOperations = reorderItems.map((item) => ({
      updateOne: {
        filter: { _id: item.id, user: item.userId },
        update: { order: item.order },
      },
    }));

    await this._model.bulkWrite(bulkOperations);
  }

  async findHighestOrderForUser(userId: string): Promise<number> {
    const highestOrderedImage = await this._model.findOne({ user: userId }).sort({ order: -1 }).exec();
    return highestOrderedImage && highestOrderedImage.order !== undefined ? highestOrderedImage.order : -1;
  }
}
