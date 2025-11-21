import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProfileInput } from './create-profile.input';
import { UserRole } from '../../domain/entities/users.entity';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;

  @Field(() => UserRole, { nullable: true })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @Field(() => CreateProfileInput)
  @ValidateNested()
  @Type(() => CreateProfileInput)
  profile: CreateProfileInput;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  preferences?: string[];
}
