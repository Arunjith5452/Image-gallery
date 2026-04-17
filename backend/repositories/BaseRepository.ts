import { injectable } from 'inversify';
import { Document, Model, UpdateQuery } from 'mongoose';
import { IBaseRepository } from './interfaces/IBaseRepository';

@injectable()
export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
  protected abstract _model: Model<T>;

  async findById(id: string): Promise<T | null> {
    return this._model.findById(id).exec();
  }

  async findOne(queryFilter: Record<string, any>): Promise<T | null> {
    return this._model.findOne(queryFilter).exec();
  }

  async findMany(queryFilter: Record<string, any>, sortOptions?: Record<string, any> | string): Promise<T[]> {
    let queryInstance = this._model.find(queryFilter);
    if (sortOptions) {
      queryInstance = queryInstance.sort(sortOptions);
    }
    return queryInstance.exec();
  }

  async create(creationPayload: Partial<T>): Promise<T> {
    return this._model.create(creationPayload);
  }

  async updateById(id: string, updatePayload: UpdateQuery<T>): Promise<T | null> {
    return this._model.findByIdAndUpdate(id, updatePayload, { new: true }).exec();
  }

  async deleteById(id: string): Promise<T | null> {
    return this._model.findByIdAndDelete(id).exec();
  }
}
