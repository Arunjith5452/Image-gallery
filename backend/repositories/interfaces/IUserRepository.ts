import { IBaseRepository } from './IBaseRepository';
import { IUser } from '../../models/User';

export interface IUserRepository extends IBaseRepository<IUser> {
  // Add any user-specific repository methods here
  // e.g. findByEmail(email: string): Promise<IUser | null>;
}
