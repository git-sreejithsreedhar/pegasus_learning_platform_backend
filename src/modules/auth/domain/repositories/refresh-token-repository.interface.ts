import { RefreshToken } from '../entities/refresh-token.entity';

export interface IRefreshTokenRepository {
  saveRefreshToken(refreshToken: RefreshToken): Promise<void>;
  findByToken(token: string): Promise<RefreshToken | null>;
  findByUserId(userId: string): Promise<RefreshToken | null>;
  clearRefreshToken(token: string): Promise<void>;
  deleteAllForUser(userId: string): Promise<void>;
}
