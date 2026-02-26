import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/modules/users/domain/tokens/tokens';
import * as mentorRepositoryInterface from 'src/modules/mentor/domain/interface/mentor.repository.interface';
import { IGetMentorDetailsUsecase } from '../interfaces/usecases.interface';
import * as usersRepositoryInterface from 'src/modules/users/domain/repositories/users-repository.interface';
import { MentorDetailsResponseDto } from '../dtos/get-mentor-details.dto';
import { MENTOR_REPOSITORY_TOKEN } from 'src/modules/mentor/domain/tokens/injection-tokens.constant';
import { FILE_STORAGE } from 'src/core/common/upload/file-storage.token';
import * as fileStorageInterface from 'src/core/common/upload/file-storage.interface';

@Injectable()
export class GetMentorDetailsUsecase implements IGetMentorDetailsUsecase {
  constructor(
    @Inject(MENTOR_REPOSITORY_TOKEN)
    private readonly mentorRepo: mentorRepositoryInterface.IMentorRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepo: usersRepositoryInterface.IUserRepository,
    @Inject(FILE_STORAGE)
    private readonly fileStorage: fileStorageInterface.IFileStorageService,
  ) {}

  /**
   * Helper to safely generate signed URLs for documents
   */
  private buildSignedUrl(doc?: {
    publicId: string;
    resourceType: fileStorageInterface.FileResourceType;
  }): string {
    if (!doc) return '';
    return this.fileStorage.generateSignedUrl(doc.publicId, doc.resourceType);
  }

  async execute(mentorId: string): Promise<MentorDetailsResponseDto> {
    // Fetch mentor
    const mentor = await this.mentorRepo.findById(mentorId);
    if (!mentor) throw new Error('Mentor not found');

    // Fetch user
    const user = await this.userRepo.findById(mentor.userId);
    if (!user) throw new Error('User not found');

    if (!mentor._id) throw new Error('Mentor Id not valid');

    // Build documents signed URLs
    const documents = {
      identificationDoc: this.buildSignedUrl(
        mentor.documents?.identificationDoc,
      ),
      educationalDoc: this.buildSignedUrl(mentor.documents?.educationalDoc),
      professionalDoc: this.buildSignedUrl(mentor.documents?.professionalDoc),
      additionalDoc: this.buildSignedUrl(mentor.documents?.additionalDoc),
    };

    return {
      _id: mentor._id.toString(),
      userId: mentor.userId,
      primarySkill: mentor.primarySkill,
      expertise: mentor.expertise,
      skillProficiency: mentor.skillProficiency,
      yearsExperience: mentor.yearsExperience,
      about: mentor.about,

      profile: {
        avatar: mentor.profile?.avatar ?? '',
        bio: mentor.profile?.bio ?? '',
      },

      socialLinks: {
        linkedin: mentor.socialLinks?.linkedin ?? '',
        twitter: mentor.socialLinks?.twitter ?? '',
        youtube: mentor.socialLinks?.youtube ?? '',
        github: mentor.socialLinks?.github ?? '',
        website: mentor.socialLinks?.website ?? '',
      },

      documents,

      communicationPref: mentor.communicationPref ?? 'chat',
      hourlyRate: mentor.hourlyRate ?? 0,
      totalStudents: mentor.totalStudents,
      totalCourses: mentor.totalCourses,

      reviews: mentor.reviews.map((r) => ({
        reviewerId: r.reviewerId,
        reviewerName: r.reviewerName,
        sessionId: r.sessionId,
        comment: r.comment,
        rating: r.rating,
        createdAt: r.createdAt.toISOString(),
      })),

      completionRate: mentor.completionRate,
      ratings: mentor.ratings,
      isApproved: mentor.isApproved,
      status: mentor.mentorStatus,

      feedback: {
        current: mentor.mentorFeedback.current,
        history: mentor.mentorFeedback.history.map((h) => ({
          mentorMessage: h.mentorMessage,
          action: h.action,
          date: h.date.toISOString(),
        })),
      },

      user: {
        name: user.name,
        email: user.email,
        status: user.isBlocked
          ? 'blocked'
          : user.isActive
            ? 'active'
            : 'inactive',
        isEmailVerified: user.isEmailVerified,
        joinDate: user.createdAt.toISOString().split('T')[0],
      },
    };
  }
}
