// // documents.dto.ts
// import { Type } from 'class-transformer';
// import {
//   IsOptional,
//   IsString,
//   IsArray,
//   IsUrl,
//   ValidateNested,
//   IsNumber,
//   IsNotEmpty,
//   IsMobilePhone,
//   IsEmail,
//   Max,
//   Min,
// } from 'class-validator';

// // Documents dto
// export class DocumentsDto {
//   @IsOptional()
//   @IsString()
//   identificationDoc?: string;

//   @IsOptional()
//   @IsString()
//   educationalDoc?: string;

//   @IsOptional()
//   @IsString()
//   professionalDoc?: string;

//   @IsOptional()
//   @IsString()
//   additionalDoc?: string;
// }

// // custom-skills.dto.ts
// export class CustomSkillsDto {
//   @IsOptional()
//   @IsArray()
//   @IsString({ each: true })
//   skills?: string[];
// }

// // social-links.dto.ts
// export class SocialLinksDto {
//   @IsOptional() @IsString() @IsUrl() linkedin?: string;
//   @IsOptional() @IsString() @IsUrl() twitter?: string;
//   @IsOptional() @IsString() @IsUrl() youtube?: string;
//   @IsOptional() @IsString() @IsUrl() github?: string;
//   @IsOptional() @IsString() @IsUrl() website?: string;
// }

// // Profile.dto.ts
// export class ProfileDto {
//   @IsString() name: string;
//   @IsString() avatar: string;
//   @IsString() bio: string;
// }

// // mentor-register.dto.ts
// export class MentorRegisterDto {
//   @IsOptional()
//   @IsString()
//   about?: string;

//   @IsOptional()
//   @IsString()
//   communicationPref?: string;

//   @IsOptional()
//   @IsArray()
//   customSkills?: string[];

//   @IsEmail()
//   email: string;

//   @IsOptional()
//   @IsArray()
//   expertise?: string[];

//   @IsOptional()
//   @IsNumber()
//   hourlyRate?: number;

//   @IsOptional()
//   @IsMobilePhone('en-IN')
//   phone?: string;

//   @IsNotEmpty()
//   @IsString()
//   primarySkill: string;

//   @IsOptional()
//   @ValidateNested()
//   @Type(() => ProfileDto)
//   profile?: ProfileDto;

//   @IsNumber()
//   @Min(1)
//   @Max(5)
//   skillProficiency?: number;

//   @IsOptional()
//   @ValidateNested()
//   @Type(() => SocialLinksDto)
//   socialLinks?: SocialLinksDto;

//   @IsOptional()
//   @IsString()
//   verificationStatus?: string;

//   @IsOptional()
//   @IsNumber()
//   yearsExperience?: number;

//   @IsOptional()
//   @ValidateNested()
//   @Type(() => DocumentsDto)
//   documents?: DocumentsDto;
// }

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

  @IsString()
  name: string;

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

  @IsString()
  email: string;

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
