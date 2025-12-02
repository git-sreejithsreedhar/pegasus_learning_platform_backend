// pending-mentor-request.dto.ts
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProfileDto {
  @IsString()
  avatar: string;

  @IsString()
  name: string;

  @IsString()
  bio: string;
}

export class SocialLinksDto {
  @IsString() @IsOptional() linkedin?: string;
  @IsString() @IsOptional() twitter?: string;
  @IsString() @IsOptional() youtube?: string;
  @IsString() @IsOptional() github?: string;
  @IsString() @IsOptional() website?: string;
}

export class DocumentsDto {
  @IsString() @IsOptional() identificationDoc?: string;
  @IsString() @IsOptional() educationalDoc?: string;
  @IsString() @IsOptional() professionalDoc?: string;
  @IsString() @IsOptional() additionalDoc?: string;
}

export class PendingMentorRequestDto {
  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsNumber()
  yearsExperience: number;

  @IsString()
  primarySkill: string;

  @IsArray()
  expertise: string[];

  @IsArray()
  customSkills: string[];

  @IsNumber()
  skillProficiency: number;

  @IsString()
  about: string;

  @IsString()
  communicationPref: string;

  @IsNumber()
  hourlyRate: number;

  @ValidateNested()
  @Type(() => ProfileDto)
  profile: ProfileDto;

  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks: SocialLinksDto;

  @ValidateNested()
  @Type(() => DocumentsDto)
  documents: DocumentsDto;

  @IsString()
  verificationStatus: string;
}
