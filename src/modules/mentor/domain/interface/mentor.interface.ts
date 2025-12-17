export interface IMentor {
  _id?: string;
  userId: string;

  primarySkill: string;
  expertise: string[];
  skillProficiency: number;
  yearsExperience: number;

  about: string;

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

  communicationPref?: string;
  hourlyRate?: number;

  isVerified?: boolean;
  verificationStatus?: {
    isVerified: boolean;
    verifiedAt?: Date;
    verifiedBy?: string;
    rejectionReason?: string;
    documentsReviewed: boolean;
    profileCompleted: boolean;
  };
}
