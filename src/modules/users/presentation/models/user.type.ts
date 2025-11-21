import {
  ObjectType,
  Field,
  registerEnumType,
  GraphQLISODateTime,
} from '@nestjs/graphql';
import { UserRole } from '../../domain/entities/users.entity';

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'Roles available for users',
});

@ObjectType()
export class UserProfileModel {
  @Field()
  name: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  bio?: string;
}

@ObjectType()
export class UserModel {
  @Field()
  _id: string;

  @Field()
  email: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field(() => UserProfileModel)
  profile: UserProfileModel;

  @Field({ nullable: true })
  isBlocked?: boolean;

  @Field({ nullable: true })
  isEmailVerified?: boolean;

  @Field(() => [String], { nullable: true })
  preferences?: string[];

  @Field(() => GraphQLISODateTime, { nullable: true })
  lastLogin?: Date;

  @Field({ nullable: true })
  refreshToken?: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
