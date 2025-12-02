import {
  IsString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class MentorRegisterDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  bio: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsArray()
  @Transform(({ value }) => Array.isArray(value ? value : [value]))
  expertise: string[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => Array.isArray(value ? value : [value]))
  customSkills?: string[];

  @IsOptional()
  @IsString()
  primarySkill?: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  skillProficiency: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  yearsExperience: number;

  @IsOptional()
  @IsString()
  linkedin?: string;

  @IsOptional()
  @IsString()
  twitter?: string;

  @IsOptional()
  @IsString()
  youtube?: string;

  @IsOptional()
  @IsString()
  github?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsString()
  communicationPref: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  hourlyRate: number;

  //   @IsArray()
  //   @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  //   languages: string[];

  //   @IsString()
  //   primaryLanguage: string;
}
