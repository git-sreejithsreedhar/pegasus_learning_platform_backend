import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRole } from 'src/modules/users/domain/entities/users.entity';

export type UserDocument = UserPersistence &
  Document & {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  collection: 'users',
})
export class UserPersistence {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: false, default: null })
  password?: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  avatar: string;

  @Prop({ required: false, default: null })
  auth0Id?: string;

  @Prop({
    type: [String],
    enum: UserRole,
    default: [UserRole.STUDENT],
  })
  roles: UserRole[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isBlocked: boolean;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ type: Date, default: null })
  lastLogin?: Date;

  @Prop({ type: String, default: null })
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserPersistence);

// indexes
// UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ auth0Id: 1 }, { sparse: true });
