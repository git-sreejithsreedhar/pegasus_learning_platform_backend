import type { IMentorRepository } from '../../domain/interface/mentor.-repository.interface';
import type { IFileStorage } from 'src/core/common/upload/file-storage.interface';
import { Logger } from '@nestjs/common/services';
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
  ): Promise<Mentor | undefined> {
    try {
      // Validate user exists
      const user = await this.userRepo.findById(userId);

      if (!user) {
        throw new HttpException('User not found', 404);
      }

      // const documents: Record<string, string> = {};

      // if (files && files.length > 0) {
      //   for (const file of files) {
      //     const storedPath = await this.fileStorage.save(file);
      //     documents[file.fieldname] = storedPath;
      //   }
      // }

      // Merge DTO documents + uploaded documents
      // const finalDocuments = {
      //   identificationDoc: documents['identificationDoc'],
      //   educationalDoc: documents['educationalDoc'],
      //   professionalDoc: documents['professionalDoc'],
      //   additionalDoc: documents['additionalDoc'],
      // };

      const finalDocuments = {
        identificationDoc: mentorData.documents?.identificationDoc,
        educationalDoc: mentorData.documents?.educationalDoc,
        professionalDoc: mentorData.documents?.professionalDoc,
        additionalDoc: mentorData.documents?.additionalDoc,
      };
      // user.profile = {
      //   name: mentorData.profile?.name || user.profile?.name,
      //   avatar: mentorData.profile?.avatar || user.profile?.avatar,
      //   bio: mentorData.profile?.bio || user.profile?.bio,
      // };

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
        // mentorData.documents,
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

      return mentor;
    } catch (error) {
      console.error(error);
    }
  }
}
