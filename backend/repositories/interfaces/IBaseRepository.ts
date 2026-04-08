import mongoose from 'mongoose';

export interface IBaseRepository<T> {

  findById(id: string): Promise<T | null>;
  findOne(filter: Record<string, any>): Promise<T | null>;
  findMany(filter: Record<string, any>, sort?: Record<string, any> | string): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  updateById(id: string, data: mongoose.UpdateQuery<T>): Promise<T | null>;
  deleteById(id: string): Promise<T | null>;
}
