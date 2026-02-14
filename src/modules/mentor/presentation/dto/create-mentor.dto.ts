import {
  IsString,
  IsNumber,
  IsInt,
  Min,
  Max,
  IsOptional,
  ValidateNested,
  // IsUrl,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProfileDto {
  @IsOptional()
  @IsString()
  avatar?: string;

  // @IsString()
  // name: string;

  @IsString()
  bio: string;
}

export class SocialLinksDto {
  // @IsUrl()
  @IsOptional()
  @IsString()
  linkedin?: string;

  // @IsUrl()
  @IsOptional()
  @IsString()
  twitter?: string;

  // @IsUrl()
  @IsOptional()
  @IsString()
  youtube?: string;

  // @IsUrl()
  @IsOptional()
  @IsString()
  github?: string;

  // @IsUrl()
  @IsOptional()
  @IsString()
  website?: string;
}

// // Documents dto
export class DocumentsDto {
  @IsOptional()
  @IsString()
  identificationDoc?: string;

  @IsOptional()
  @IsString()
  educationalDoc?: string;

  @IsOptional()
  @IsString()
  professionalDoc?: string;

  @IsOptional()
  @IsString()
  additionalDoc?: string;
}

export class MentorRegisterDto {
  // @IsString()
  // name: string;

  // @IsString()
  // email: string;

  @IsString()
  phone: string;

  // @IsString()
  // bio: string;

  @IsString()
  about: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  expertise: string[];

  // @IsArray()
  // @IsString({ each: true })
  // customSkills: string[];

  @IsString()
  primarySkill: string;

  @IsInt()
  @Min(1)
  @Max(5)
  skillProficiency: number;

  @IsInt()
  @Min(0)
  yearsExperience: number;

  @IsNumber()
  hourlyRate: number;

  @IsString()
  communicationPref: string;

  @ValidateNested()
  @Type(() => ProfileDto)
  profile: ProfileDto;

  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks: SocialLinksDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DocumentsDto)
  documents?: DocumentsDto;
}
