import { User } from 'src/modules/users/domain/entities/users.entity';

export interface IAuthUserRepository {
  findbyEmail(email: string): Promise<User | null>;
  saveRefreshToken(userId: string, token: string): Promise<void>;
}
