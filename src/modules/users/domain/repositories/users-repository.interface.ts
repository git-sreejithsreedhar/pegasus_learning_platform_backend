import { User } from '../entities/users.entity';

export interface IUserRepository {
  findByEmail(id: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  update(user: User): Promise<User | null>;
  // isEmailVerified(id: string): Promise<boolean>;
  // delete(id: string): Promise<void>;
}
