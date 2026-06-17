import { DocumentsDto, SocialLinksDto } from './create-mentor.dto';

export class UpdateMentorDto {
  primarySkill?: string;
  expertise?: string[];
  skillProficiency?: number;
  yearsExperience?: number;
  about?: string;
  socialLinks?: SocialLinksDto;
  documents?: DocumentsDto;
  communicationPref?: string;
  hourlyRate?: number;
}
