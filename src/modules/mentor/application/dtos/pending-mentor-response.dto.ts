// pending-mentor-response.dto.ts
export class PendingMentorResponseDto {
  id: string;
  email: string;
  phone: string;
  yearsExperience: number;
  primarySkill: string;

  expertise: string[];
  customSkills: string[];
  skillProficiency: number;

  about: string;
  communicationPref: string;
  hourlyRate: number;

  profile: {
    avatar: string;
    name: string;
    bio: string;
  };

  socialLinks: {
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    github?: string;
    website?: string;
  };

  documents: {
    identificationDoc?: string;
    educationalDoc?: string;
    professionalDoc?: string;
    additionalDoc?: string;
  };

  verificationStatus: {
    status: 'pending' | 'approved' | 'rejected';
    verifiedAt?: Date;
    verifiedBy?: string;
    rejectionReason?: string;
    documentsReviewed: boolean;
  };

  createdAt: Date;
  updatedAt: Date;
}
