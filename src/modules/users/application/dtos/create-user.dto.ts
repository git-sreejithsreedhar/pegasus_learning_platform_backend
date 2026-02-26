// This is the clean structure used by the Application/Domain layer
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  // ValidateNested,
  IsArray,
} from 'class-validator';
import { UserRole } from '../../domain/entities/users.entity';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsArray()
  @IsEnum(UserRole, { each: true })
  @IsOptional()
  roles?: UserRole[];

  // @ValidateNested()
  // @Type(() => CreateProfileDto)
  // profile: CreateProfileDto;

  // @IsArray()
  // @IsOptional()
  // preferences?: string[];
}
