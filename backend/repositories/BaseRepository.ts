import { injectable } from 'inversify';
import { Document, Model, UpdateQuery } from 'mongoose';
import { IBaseRepository } from './interfaces/IBaseRepository';

@injectable()
export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
  protected abstract model: Model<T>;


  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findOne(filter: Record<string, any>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async findMany(filter: Record<string, any>, sort?: Record<string, any> | string): Promise<T[]> {
    let query = this.model.find(filter);
    if (sort) {
      query = query.sort(sort);
    }
    return query.exec();
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async updateById(id: string, data: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteById(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
