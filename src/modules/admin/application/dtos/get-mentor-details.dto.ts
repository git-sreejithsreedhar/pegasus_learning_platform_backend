export type MentorStatus =
  | 'approved'
  | 'rejected'
  | 'correction_required'
  | 'pending';

/* ------------------ Feedback ------------------ */

export interface FeedbackHistoryDto {
  mentorMessage: string;
  action: MentorStatus;
  date: string;
}

export interface AdminFeedbackDto {
  current?: {
    mentorMessage: string;
    action: MentorStatus;
  };
  history: FeedbackHistoryDto[];
}

// User ---------------

export interface MentorUserDto {
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'blocked';
  isEmailVerified: boolean;
  joinDate: string;
}

/* ------------------ Reviews ------------------ */

export interface ReviewDto {
  reviewerId: string;
  reviewerName?: string;
  sessionId?: string;
  comment: string;
  rating: number;
  createdAt: string;
}

/* ------------------ Main DTO ------------------ */

export interface MentorDetailsResponseDto {
  _id: string;
  userId: string;

  primarySkill: string;
  expertise: string[];
  skillProficiency: number;
  yearsExperience: number;
  about: string;

  profile: {
    avatar: string;
    bio: string;
  };

  socialLinks: {
    linkedin: string;
    twitter: string;
    youtube: string;
    github: string;
    website: string;
  };

  documents: {
    identificationDoc: string;
    educationalDoc: string;
    professionalDoc: string;
    additionalDoc: string;
  };

  communicationPref: string;
  hourlyRate: number;

  totalStudents: number;
  totalCourses: number;

  reviews: ReviewDto[];

  completionRate: number;
  ratings: number[];

  isApproved: boolean;
  status: MentorStatus;

  feedback: AdminFeedbackDto;

  user: MentorUserDto;
}
