import { injectable } from 'inversify';
import { BaseRepository } from './BaseRepository';
import { IUserRepository } from './interfaces/IUserRepository';
import User, { IUser } from '../models/User';

@injectable()
export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  protected model = User;
}
