import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import {
  User,
  UserProfile,
} from 'src/modules/users/domain/entities/users.entity';
import { IUserRepository } from 'src/modules/users/domain/repositories/users-repository.interface';
import { UserDocument } from '../models/user.schema';

export class MongoUserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await this.userModel.findOne({ email }).exec();
    return userDoc ? this.toDomain(userDoc) : null;
  }

  async findById(id: string): Promise<User | null> {
    const userDoc = await this.userModel.findById(id).exec();
    return userDoc ? this.toDomain(userDoc) : null;
  }

  async save(user: User): Promise<User> {
    const userDoc = new this.userModel(this.toPersistence(user));
    const savedDoc = await userDoc.save();
    return this.toDomain(savedDoc);
  }

  async update(user: User): Promise<User | null> {
    const updatedDoc = await this.userModel
      .findByIdAndUpdate(user._id, this.toPersistence(user), { new: true })
      .exec();
    return updatedDoc ? this.toDomain(updatedDoc) : null;
  }

  async updateEmailVerified(id: string): Promise<void> {
    await this.userModel.updateOne({ _id: id }, { isEmailVerified: true });
  }

  private toDomain(userDoc: UserDocument): User {
    return User.reconstitute({
      _id: userDoc._id.toString(),
      email: userDoc.email,
      password: userDoc.password,
      role: userDoc.role,
      profile: new UserProfile(
        userDoc.profile.name,
        userDoc.profile.avatar,
        userDoc.profile.bio,
      ),
      isBlocked: userDoc.isBlocked,
      isEmailVerified: userDoc.isEmailVerified,
      preferences: userDoc.preferences,
      lastLogin: userDoc.lastLogin,
      // refreshToken: userDoc.refreshToken,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
    });
  }

  private toPersistence(user: User): Partial<UserDocument> {
    return {
      _id: user._id,
      email: user.email,
      password: user.password,
      role: user.role,
      profile: {
        name: user.profile.name,
        avatar: user.profile.avatar,
        bio: user.profile.bio,
      },
      isBlocked: user.isBlocked,
      preferences: user.preferences,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin,
      // createdAt: user.createdAt,
      // updatedAt: user.updatedAt,
    };
  }
}
