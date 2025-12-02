export class MentorProfileDto {
  avatar: string;
  bio: string;
  name: string;
}

export class MentorSocialLinksDto {
  linkedin?: string;
  youtube?: string;
  website?: string;
  twitter?: string;
  github?: string;
}

export class MentorExpertiseDto {
  id: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export class MentorVerificationStatusDto {
  isVerified: boolean;
  verifiedAt?: Date;
  verifiedBy?: string;
  rejectionReason?: string;
  documentsReviewed: boolean;
  profileCompleted: boolean;
}

export class MentorReviewDto {
  id: string;
  studentId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export class MentorDocumentsDto {
  identificationDoc?: string;
  educationalDoc?: string;
  professionalDoc?: string;
  additionalDoc?: string;
}

export class MentorDto {
  id: string;
  profile: MentorProfileDto;
  expertise: MentorExpertiseDto[];
  socialLinks: MentorSocialLinksDto;
  about: string;
  isEmailVerified: boolean;
  isVerified: boolean;
  verificationStatus: MentorVerificationStatusDto;
  documents: MentorDocumentsDto;
  totalStudents: number;
  totalCourses: number;
  studentReviews: MentorReviewDto[];
  completionRate: number;
  rating: number;
  languages: string[];
  hourlyRate?: number;
}
