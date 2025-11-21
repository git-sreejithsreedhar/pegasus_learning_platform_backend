import { InjectModel } from '@nestjs/mongoose';
import { IRefreshTokenRepository } from 'src/modules/auth/domain/repositories/refresh-token-repository.interface';
import { RefreshTokenDocument } from '../models/mongo-refreshToken.schema';
import { Model } from 'mongoose';
import { RefreshToken } from 'src/modules/auth/domain/entities/refresh-token.entity';

export class MongoRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    @InjectModel('RefreshToken')
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  //   Save refresh token
  async saveRefreshToken(refreshToken: RefreshToken): Promise<void> {
    await this.refreshTokenModel.findOneAndUpdate(
      { userId: refreshToken.userId },
      {
        token: refreshToken.token,
        expiresAt: refreshToken.expiresAt,
        createdAt: refreshToken.createdAt,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );
  }

  //   find by refresh-token
  async findByToken(token: string): Promise<RefreshToken | null> {
    const doc = await this.refreshTokenModel.findOne({ token }).exec();
    if (!doc) {
      return null;
    }
    return new RefreshToken(
      doc.userId,
      doc.token,
      doc.expiresAt,
      doc.createdAt,
    );
  }

  //   find by userId
  async findByUserId(userId: string): Promise<RefreshToken | null> {
    const doc = await this.refreshTokenModel.findOne({ userId }).exec();
    if (!doc) {
      return null;
    }
    return new RefreshToken(
      doc.userId,
      doc.token,
      doc.expiresAt,
      doc.createdAt,
    );
  }

  //   clear refresh token by token string
  async clearRefreshToken(token: string): Promise<void> {
    await this.refreshTokenModel.deleteOne({ token }).exec();
  }

  //   clear refresh token by userId
  async deleteAllForUser(userId: string): Promise<void> {
    await this.refreshTokenModel.deleteMany({ userId }).exec();
  }
}
