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
import { CreateProfileDto } from './create-profile.dto';
import { Type } from 'class-transformer';
import { UserRole } from '../../domain/entities/users.entity';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ValidateNested()
  @Type(() => CreateProfileDto)
  profile: CreateProfileDto;

  @IsArray()
  @IsOptional()
  preferences?: string[];
}
