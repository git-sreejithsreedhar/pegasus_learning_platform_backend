import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { User } from 'src/modules/users/domain/entities/users.entity';
import { IUserRepository } from 'src/modules/users/domain/repositories/users-repository.interface';
import { UserDocument } from '../models/user.schema';
import { BaseRepository } from 'src/core/database/mongo-base.repository';
import { Logger } from 'winston';
import { Inject } from '@nestjs/common';
import { Types } from 'mongoose';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

export class MongoUserRepository
  extends BaseRepository
  implements IUserRepository
{
  protected logger: Logger;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) logger: Logger,
  ) {
    super();
    this.logger = logger;
  }

  // find by email
  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await this.userModel.findOne({ email }).exec();
    return userDoc ? this.toDomain(userDoc) : null;
  }

  // find by Auth0Id
  async findByAuth0Id(auth0Id: string): Promise<User | null> {
    const userDoc = await this.userModel.findOne({ auth0Id }).exec();
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
      avatar: userDoc.avatar,
      roles: userDoc.roles,
      isActive: userDoc.isActive,
      isBlocked: userDoc.isBlocked,
      isEmailVerified: userDoc.isEmailVerified,
      // preferences: userDoc.preferences,
      lastLogin: userDoc.lastLogin,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
    });
  }

  private toPersistence(user: User): Partial<UserDocument> {
    return {
      _id: new Types.ObjectId(user._id),
      email: user.email,
      password: user.password,
      name: user.name,
      avatar: user.avatar,
      roles: user.roles,
      isBlocked: user.isBlocked,
      // preferences: user.preferences,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin,
    };
  }
}
