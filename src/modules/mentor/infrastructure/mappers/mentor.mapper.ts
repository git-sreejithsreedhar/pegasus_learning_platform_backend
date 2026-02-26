import { Mentor, MentorStatus } from '../../domain/entities/mentor.entity';
import { MentorDocument } from '../database/models/mentor.schema';

export class MentorMapper {
  // static toDomain(doc: MentorDocument): Mentor {
  static toDomain(doc: any): Mentor {
    return new Mentor(
      doc._id.toString(),
      doc.userId,
      doc.primarySkill,
      doc.expertise ?? [],
      doc.skillProficiency ?? 0,
      doc.yearsExperience ?? 0,
      doc.about ?? '',
      {
        avatar: doc.profile?.avatar ?? '',
        bio: doc.profile?.bio ?? '',
      },
      {
        linkedin: doc.socialLinks?.linkedin ?? undefined,
        twitter: doc.socialLinks?.twitter ?? undefined,
        youtube: doc.socialLinks?.youtube ?? undefined,
        github: doc.socialLinks?.github ?? undefined,
        website: doc.socialLinks?.website ?? undefined,
      },
      // doc.documents ?? {},
      {
        identificationDoc: doc.documents?.identificationDoc
          ? {
              ...doc.documents.identificationDoc,
              originalName:
                doc.documents.identificationDoc.originalName ?? undefined,
            }
          : undefined,

        educationalDoc: doc.documents?.educationalDoc
          ? {
              ...doc.documents.educationalDoc,
              originalName:
                doc.documents.educationalDoc.originalName ?? undefined,
            }
          : undefined,

        professionalDoc: doc.documents?.professionalDoc
          ? {
              ...doc.documents.professionalDoc,
              originalName:
                doc.documents.professionalDoc.originalName ?? undefined,
            }
          : undefined,

        additionalDoc: doc.documents?.additionalDoc
          ? {
              ...doc.documents.additionalDoc,
              originalName:
                doc.documents.additionalDoc.originalName ?? undefined,
            }
          : undefined,
      },

      doc.totalStudents ?? 0,
      doc.totalCourses ?? 0,
      // doc.reviews ?? [],
      (doc.reviews ?? []).map((review) => ({
        reviewerId: review.reviewerId,
        comment: review.comment,
        rating: review.rating,
        createdAt: review.createdAt as Date,
        sessionId: review.sessionId ?? undefined,
      })),
      doc.completionRate ?? 0,
      doc.ratings ?? [],
      doc.isApproved ?? false,
      doc.communicationPref ?? undefined,
      doc.hourlyRate ?? undefined,
      doc.status,
      // {
      //   current: doc.feedback?.current,
      //   history: doc.feedback?.history ?? [],
      // },
      {
        current: doc.feedback?.current
          ? {
              mentorMessage: doc.feedback.current.mentorMessage ?? '',
              action: doc.feedback.current.action as MentorStatus,
            }
          : undefined,

        history:
          doc.feedback?.history?.map((h) => ({
            mentorMessage: h.mentorMessage ?? '',
            action: h.action as MentorStatus,
            date: h.date as Date,
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
