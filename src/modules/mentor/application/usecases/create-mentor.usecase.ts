import type { IMentorRepository } from '../../domain/interface/mentor.repository.interface';
import type { IFileStorage } from 'src/core/common/upload/file-storage.interface';
import { Logger } from 'winston';
import { HttpException } from '@nestjs/common';
import { MentorRegisterDto } from '../../presentation/dto/create-mentor.dto';
import { Mentor } from '../../domain/entities/mentor.entity';
import { ICreateMentorUsecase } from '../../domain/interface/usecases.interface';
import { IUserRepository } from 'src/modules/users/domain/repositories/users-repository.interface';

export class CreateMentorUsecase implements ICreateMentorUsecase {
  constructor(
    private readonly mentorRepo: IMentorRepository,
    private readonly userRepo: IUserRepository,
    private readonly fileStorage: IFileStorage,
    private readonly logger: Logger,
  ) {}
  async execute(
    userId: string,
    mentorData: MentorRegisterDto,
    // files:? Express.Multer.File[],
  ): Promise<Mentor> {
    try {
      // Validate user exists
      const user = await this.userRepo.findById(userId);

      if (!user) {
        throw new HttpException('User not found', 404);
      }

      const finalDocuments = {
        identificationDoc: mentorData.documents?.identificationDoc,
        educationalDoc: mentorData.documents?.educationalDoc,
        professionalDoc: mentorData.documents?.professionalDoc,
        additionalDoc: mentorData.documents?.additionalDoc,
      };

      await this.userRepo.update(user);

      const mentorEntity = new Mentor(
        undefined,
        userId,
        mentorData.primarySkill,
        mentorData.expertise ?? [],
        mentorData.skillProficiency ?? 1,
        mentorData.yearsExperience ?? 0,
        mentorData.about ?? '',

        mentorData.profile || {},
        mentorData.socialLinks || {},
        finalDocuments,
        0, // totalStudents
        0, // totalCourses
        [], // reviews
        0, // completionRate
        [], // ratings
        false, // isApproved
        mentorData.communicationPref,
        mentorData.hourlyRate,
      );

      const mentor = await this.mentorRepo.create(mentorEntity);

      this.logger.info('mentor created', { userId });

      return mentor;
    } catch (error) {
      this.logger.error('CreateMentorUsecase failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }
}
