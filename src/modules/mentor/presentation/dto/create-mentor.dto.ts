import {
  IsString,
  IsNumber,
  IsInt,
  Min,
  Max,
  IsOptional,
  ValidateNested,
  IsArray,
  ArrayNotEmpty,
  IsEnum,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProfileDto {
  @IsOptional()
  @IsString()
  avatar?: string;

  @IsString()
  bio: string;
}

export class SocialLinksDto {
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
}

export class SignedDocumentDto {
  @IsString()
  publicId: string;

  @IsEnum(['image', 'video', 'raw'])
  resourceType: 'image' | 'video' | 'raw';

  @IsOptional()
  @IsString()
  originalName?: string;

  // @IsOptional()
  @IsDate()
  uploadedAt: Date;
}

export class DocumentsDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => SignedDocumentDto)
  identificationDoc?: SignedDocumentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SignedDocumentDto)
  educationalDoc?: SignedDocumentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SignedDocumentDto)
  professionalDoc?: SignedDocumentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SignedDocumentDto)
  additionalDoc?: SignedDocumentDto;
}

export class MentorRegisterDto {
  @IsString()
  phone: string;

  @IsString()
  about: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  expertise: string[];

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
