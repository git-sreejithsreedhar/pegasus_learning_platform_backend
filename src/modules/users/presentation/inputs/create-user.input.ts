import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
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
  roles?: UserRole[];

  // @Field(() => CreateProfileInput)
  // @ValidateNested()
  // @Type(() => CreateProfileInput)
  // profile: CreateProfileInput;

  // @Field(() => [String], { nullable: true })
  // @IsArray()
  // @IsOptional()
  // preferences?: string[];
}
