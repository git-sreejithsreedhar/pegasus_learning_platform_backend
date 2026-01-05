import { Mentor } from '../../domain/entities/mentor.entity';
import { MentorDocument } from '../database/models/mentor.schema';

export class MentorMapper {
  static toDomain(doc: MentorDocument): Mentor {
    return new Mentor(
      doc._id.toString(),
      doc.userId,
      doc.primarySkill,
      doc.expertise,
      doc.skillProficiency,
      doc.yearsExperience,
      doc.about,
      doc.profile,
      doc.socialLinks,
      doc.documents,
      doc.totalStudents,
      doc.totalCourses,
      doc.reviews,
      doc.completionRate,
      doc.ratings,
      doc.isApproved,
      doc.communicationPref,
      doc.hourlyRate,
      doc.status,
      doc.feedback,
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
