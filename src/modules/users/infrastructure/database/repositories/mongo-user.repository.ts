import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import {
  User,
  // UserProfile,
} from 'src/modules/users/domain/entities/users.entity';
import { IUserRepository } from 'src/modules/users/domain/repositories/users-repository.interface';
import { UserDocument } from '../models/user.schema';

export class MongoUserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  // find by email
  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await this.userModel.findOne({ email }).exec();
    return userDoc ? this.toDomain(userDoc) : null;
  }

  // find by id
  async findById(id: string): Promise<User | null> {
    const userDoc = await this.userModel.findById(id).exec();
    return userDoc ? this.toDomain(userDoc) : null;
  }

  // save new user
  async save(user: User): Promise<User> {
    const userDoc = new this.userModel(this.toPersistence(user));
    const savedDoc = await userDoc.save();
    return this.toDomain(savedDoc);
  }

  // update user
  async update(user: User): Promise<User | null> {
    const updatedDoc = await this.userModel
      .findByIdAndUpdate(user._id, this.toPersistence(user), { new: true })
      .exec();
    return updatedDoc ? this.toDomain(updatedDoc) : null;
  }

  // update email verified
  async updateEmailVerified(id: string): Promise<void> {
    await this.userModel.updateOne({ _id: id }, { isEmailVerified: true });
  }

  // block user
  async blockUser(id: string): Promise<void> {
    await this.userModel.updateOne({ _id: id }, { isBlocked: true });
  }

  // find by IDs
  async findByIds(ids: string[]): Promise<User[]> {
    const users = await this.userModel.find({ _id: { $in: ids } }).exec();

    return users.map((doc) => this.toDomain(doc));
  }

  // get all users
  async getAllUsers(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users.map((doc) => this.toDomain(doc));
  }

  async getAllActiveUsers(): Promise<User[]> {
    const users = await this.userModel.find({ isActive: true }).exec();
    return users.map((doc) => this.toDomain(doc));
  }

  async getAllBlockedUsers(): Promise<User[]> {
    const users = await this.userModel.find({ isBlocked: true }).exec();
    return users.map((doc) => this.toDomain(doc));
  }

  async getAllInactiveUsers(): Promise<User[]> {
    const users = await this.userModel.find({ isActive: false }).exec();
    return users.map((doc) => this.toDomain(doc));
  }

  async TotalUsersCount(): Promise<number> {
    const count = await this.userModel.countDocuments();
    return count;
  }

  private toDomain(userDoc: UserDocument): User {
    return User.reconstitute({
      _id: userDoc._id.toString(),
      email: userDoc.email,
      password: userDoc.password,
      name: userDoc.name,
      roles: userDoc.roles,
      isActive: userDoc.isActive,
      // profile: new UserProfile(
      //   userDoc.profile.name,
      //   userDoc.profile.avatar,
      //   userDoc.profile.bio,
      // ),
      isBlocked: userDoc.isBlocked,
      isEmailVerified: userDoc.isEmailVerified,
      // preferences: userDoc.preferences,
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
      name: user.name,
      roles: user.roles,
      // profile: {
      //   name: user.profile.name,
      //   avatar: user.profile.avatar,
      //   bio: user.profile.bio,
      // },
      isBlocked: user.isBlocked,
      // preferences: user.preferences,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin,
      // createdAt: user.createdAt,
      // updatedAt: user.updatedAt,
    };
  }
}
