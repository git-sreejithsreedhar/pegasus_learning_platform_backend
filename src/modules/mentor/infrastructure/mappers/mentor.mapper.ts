import { Mentor, MentorStatus } from '../../domain/entities/mentor.entity';
import { MentorDocument } from '../database/models/mentor.schema';

type FileResourceType = 'image' | 'video' | 'raw';

interface PersistedFile {
  publicId: string;
  resourceType: FileResourceType;
  originalName?: string;
  uploadedAt: Date;
}

interface PersistedReview {
  reviewerId: string;
  comment: string;
  rating: number;
  createdAt: Date;
  sessionId?: string;
}

interface PersistedMentor {
  _id: { toString(): string };
  userId: string;
  primarySkill: string;
  expertise?: string[];
  skillProficiency?: number;
  yearsExperience?: number;
  about?: string;
  profile?: {
    avatar?: string;
    bio?: string;
  };
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    github?: string;
    website?: string;
  };
  documents?: {
    identificationDoc?: PersistedFile;
    educationalDoc?: PersistedFile;
    professionalDoc?: PersistedFile;
    additionalDoc?: PersistedFile;
  };
  totalStudents?: number;
  totalCourses?: number;
  reviews?: PersistedReview[];
  completionRate?: number;
  ratings?: number[];
  isApproved?: boolean;
  communicationPref?: string;
  hourlyRate?: number;
  status: MentorStatus;
  feedback?: {
    current?: {
      mentorMessage?: string;
      action: MentorStatus;
    };
    history?: Array<{
      mentorMessage?: string;
      action: MentorStatus;
      date: Date;
    }>;
  };
}

export class MentorMapper {
  static toDomain(doc: MentorDocument): Mentor {
    const mentor = doc as PersistedMentor;

    return new Mentor(
      mentor._id.toString(),
      mentor.userId,
      mentor.primarySkill,
      mentor.expertise ?? [],
      mentor.skillProficiency ?? 0,
      mentor.yearsExperience ?? 0,
      mentor.about ?? '',
      {
        avatar: mentor.profile?.avatar ?? '',
        bio: mentor.profile?.bio ?? '',
      },
      {
        linkedin: mentor.socialLinks?.linkedin ?? undefined,
        twitter: mentor.socialLinks?.twitter ?? undefined,
        youtube: mentor.socialLinks?.youtube ?? undefined,
        github: mentor.socialLinks?.github ?? undefined,
        website: mentor.socialLinks?.website ?? undefined,
      },
      {
        identificationDoc: mentor.documents?.identificationDoc
          ? {
              ...mentor.documents.identificationDoc,
              originalName: mentor.documents.identificationDoc.originalName,
            }
          : undefined,

        educationalDoc: mentor.documents?.educationalDoc
          ? {
              ...mentor.documents.educationalDoc,
              originalName: mentor.documents.educationalDoc.originalName,
            }
          : undefined,

        professionalDoc: mentor.documents?.professionalDoc
          ? {
              ...mentor.documents.professionalDoc,
              originalName: mentor.documents.professionalDoc.originalName,
            }
          : undefined,

        additionalDoc: mentor.documents?.additionalDoc
          ? {
              ...mentor.documents.additionalDoc,
              originalName: mentor.documents.additionalDoc.originalName,
            }
          : undefined,
      },

      mentor.totalStudents ?? 0,
      mentor.totalCourses ?? 0,
      (mentor.reviews ?? []).map((review) => ({
        reviewerId: review.reviewerId,
        comment: review.comment,
        rating: review.rating,
        createdAt: review.createdAt,
        sessionId: review.sessionId ?? undefined,
      })),
      mentor.completionRate ?? 0,
      mentor.ratings ?? [],
      mentor.isApproved ?? false,
      mentor.communicationPref ?? undefined,
      mentor.hourlyRate ?? undefined,
      mentor.status,
      {
        current: mentor.feedback?.current
          ? {
              mentorMessage: mentor.feedback.current.mentorMessage ?? '',
              action: mentor.feedback.current.action,
            }
          : undefined,

        history:
          mentor.feedback?.history?.map((h) => ({
            mentorMessage: h.mentorMessage ?? '',
            action: h.action,
            date: h.date,
          })) ?? [],
      },
    );
  }

  static toPersistence(mentor: Mentor) {
    return {
      userId: mentor.userId,
      primarySkill: mentor.primarySkill,
      expertise: mentor.expertise,
      skillProficiency: mentor.skillProficiency,
      yearsExperience: mentor.yearsExperience,
      about: mentor.about,
      profile: mentor.profile,
      socialLinks: mentor.socialLinks,
      documents: mentor.documents,
      communicationPref: mentor.communicationPref,
      hourlyRate: mentor.hourlyRate,
      totalStudents: mentor.totalStudents,
      totalCourses: mentor.totalCourses,
      reviews: mentor.reviews,
      completionRate: mentor.completionRate,
      ratings: mentor.ratings,
      isApproved: mentor.isApproved,
      status: mentor.mentorStatus,
      feedback: mentor.mentorFeedback,
    };
  }
}
