import { injectable, inject } from 'inversify';
import mongoose from 'mongoose';
import { TYPES } from '../types';
import { IImageService } from './interfaces/IImageService';
import { IImageRepository } from '../repositories/interfaces/IImageRepository';
import { IImage } from '../models/Image';
import { UpdateQuery } from 'mongoose';
import { cloudinary } from '../config/cloudinary';
import { UploadApiResponse } from 'cloudinary';

@injectable()
export class ImageService implements IImageService {
  private imageRepository: IImageRepository;

  constructor(@(inject(TYPES.IImageRepository) as ParameterDecorator) imageRepository: IImageRepository) {
    this.imageRepository = imageRepository;
  }

  async getImages(userId: string): Promise<IImage[]> {
    return this.imageRepository.findUserImages(userId);
  }

  async uploadImages(files: Express.Multer.File[], titlesMap: Record<string, string>, userId: string): Promise<IImage[]> {
    if (!files || files.length === 0) {
      throw new Error('No images provided');
    }

    let currentOrder = await this.imageRepository.findHighestOrderForUser(userId);
    currentOrder = currentOrder !== -1 ? currentOrder + 1 : 0;

    const uploadPromises = files.map(async (file) => {
      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'image-gallery',
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as UploadApiResponse);
          }
        );
        uploadStream.end(file.buffer);
      });

      return {
        title: titlesMap[file.originalname] || file.originalname.split('.')[0],
        cloudinaryPublicId: result.public_id,
        imageUrl: result.secure_url,
        mimetype: file.mimetype,
        order: currentOrder++,
        user: new mongoose.Types.ObjectId(userId),
      };
    });

    const imageDocs = await Promise.all(uploadPromises);
    const createdImages = await this.imageRepository.bulkCreate(imageDocs);
    return createdImages;
  }

  async updateImage(id: string, userId: string, title?: string, newFile?: Express.Multer.File): Promise<IImage | null> {
    const image = await this.imageRepository.findById(id);

    if (!image) {
      throw new Error('Image not found');
    }

    if (image.user.toString() !== userId) {
      throw new Error('User not authorized');
    }

    const updateData: UpdateQuery<IImage> = {};
    if (title) updateData.title = title;

    if (newFile) {
      await cloudinary.uploader.destroy(image.cloudinaryPublicId);

      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'image-gallery',
            public_id: image.cloudinaryPublicId,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as UploadApiResponse);
          }
        );
        uploadStream.end(newFile.buffer);
      });

      updateData.cloudinaryPublicId = result.public_id;
      updateData.imageUrl = result.secure_url;
      updateData.mimetype = newFile.mimetype;
    }

    const updatedImage = await this.imageRepository.updateById(id, updateData);
    return updatedImage;
  }

  async deleteImage(id: string, userId: string): Promise<void> {
    const image = await this.imageRepository.findById(id);

    if (!image) {
      throw new Error('Image not found');
    }

    if (image.user.toString() !== userId) {
      throw new Error('User not authorized');
    }

    await cloudinary.uploader.destroy(image.cloudinaryPublicId);

    await this.imageRepository.deleteById(id);
  }

  async reorderImages(items: { id: string; order: number }[], userId: string): Promise<void> {
    if (!items || !items.length) {
      throw new Error('No items provided for reordering');
    }

    const itemsWithUserId = items.map(item => ({ ...item, userId }));
    await this.imageRepository.bulkUpdateOrder(itemsWithUserId);
  }
}
