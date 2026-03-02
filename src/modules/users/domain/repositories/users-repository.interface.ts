import { User } from '../entities/users.entity';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByAuth0Id(auth0Id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  update(user: User): Promise<User | null>;
  updateEmailVerified(id: string): Promise<void>;
  getAllUsers(): Promise<User[]>;

  getAllBlockedUsers(): Promise<User[]>;
  getAllActiveUsers(): Promise<User[]>;
  getAllInactiveUsers(): Promise<User[]>;

  TotalUsersCount(): Promise<number>;
}
