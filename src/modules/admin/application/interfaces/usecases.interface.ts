// import { Mentor } from 'src/modules/mentor/domain/entities/mentor.entity';
import { PaginatedResultDto } from 'src/core/common/pagination/pagination.interface';
import { AdminUserListDto } from '../dtos/admin-user-list.dto';
import { MentorDetailsResponseDto } from '../dtos/get-mentor-details.dto';

export type SortOrder = 'asc' | 'desc';

// Metor listing
export enum MentorSortBy {
  JOIN_DATE = 'joinDate',
  NAME = 'name',
  EMAIL = 'email',
  RATING = 'rating',
  COURSES = 'courses',
  STATUS = 'status',
}

export enum AdminUserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
}

// Mentor details
// export type MentorStatus =  'approved' | 'rejected' | 'correction_required' | 'pending';

// export interface AdminFeedback {
//   current?: {
//     mentorMessage: string;
//     action: MentorStatus;
//   };
//   history: FeedbackHistory[];
// }

// interface MentorUser {
//   name: string;
//   email: string;
//   status: string;
//   isEmailVerified: boolean;
//   joinDate: string;
// }

// export interface MentorDetails {
//   _id: string;
//   userId: string;
//   primarySkill: string;
//   expertise: string[];
//   skillProficiency: number;
//   yearsExperience: number;
//   about: string;
//   profile: {
//     avatar: string;
//     bio: string;
//   };
//   socialLinks: {
//     linkedin: string;
//     twitter: string;
//     youtube: string;
//     github: string;
//     website: string;
//   };
//   documents: {
//     identificationDoc: string;
//     educationalDoc: string;
//     professionalDoc: string;
//     additionalDoc: string;
//   };
//   communicationPref: string;
//   hourlyRate: number;
//   totalStudents: number;
//   totalCourses: number;
//   reviews: Review[];
//   completionRate: number;
//   ratings: number[];
//   isApproved: boolean;
//   status: MentorStatus;
//   feedback:
//   user?: MentorUser;
// }

// export interface Review {
//   reviewerId: string;
//   reviewerName?: string;
//   sessionId?: string;
//   comment: string;
//   rating: number;
//   createdAt: string;
// }

export interface IFindAllMentorsUsecase {
  execute(params?: {
    page?: number;
    limit?: number;
    status?: AdminUserStatus;
    sortBy?: MentorSortBy;
    sortOrder?: SortOrder;
  }): Promise<PaginatedResultDto<AdminUserListDto>>;
}

export interface IGetMentorDetailsUsecase {
  execute(mentorId: string): Promise<MentorDetailsResponseDto>;
}
