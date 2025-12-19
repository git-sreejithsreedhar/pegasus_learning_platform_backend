import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserRole } from 'src/modules/users/domain/entities/users.entity';

export type UserDocument = UserPersistence &
  Document & { createdAt: Date; updatedAt: Date };

@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  collection: 'users',
})
export class UserPersistence {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  // @Prop({
  //   type: String,
  //   enum: UserRole,
  //   default: UserRole.USER,
  // })
  // role: UserRole;
  @Prop({
    type: [String],
    enum: UserRole,
    default: [UserRole.STUDENT],
  })
  roles: UserRole[];

  // @Prop({
  //   type: {
  //     name: { type: String, required: true },
  //     avatar: String,
  //     bio: String,
  //   },
  //   required: true,
  // })
  // profile: {
  //   name: string;
  //   avatar?: string;
  //   bio?: string;
  // };
  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isBlocked: boolean;

  // @Prop({ type: [String], default: [] })
  // preferences: string[];

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ type: Date, default: null })
  lastLogin?: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserPersistence);
