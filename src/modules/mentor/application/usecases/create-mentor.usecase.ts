import type { IMentorRepository } from '../../domain/interface/mentor.repository.interface';
import type { IUserRepository } from 'src/modules/users/domain/repositories/users-repository.interface';
import type { ICreateMentorUsecase } from '../IUseCase/usecases.interface';
import { MentorRegisterDto } from '../../presentation/dto/create-mentor.dto';
import { Mentor } from '../../domain/entities/mentor.entity';
import { HttpException } from '@nestjs/common';
import { Logger } from 'winston';
import { CreateMentorResponse } from '../dto/create-mentor.response';

export class CreateMentorUsecase implements ICreateMentorUsecase {
  constructor(
    private readonly mentorRepo: IMentorRepository,
    private readonly userRepo: IUserRepository,
    private readonly logger: Logger,
  ) {}

  async execute(
    userId: string,
    mentorData: MentorRegisterDto,
  ): Promise<CreateMentorResponse> {
    console.log('Crete Mntor usecase Hit');
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const existingMentor = await this.mentorRepo.findByUserId(userId);

    if (existingMentor) {
      const status = existingMentor.mentorStatus;

      if (status === 'approved') {
        throw new HttpException('You are already an approved mentor', 409);
      }

      if (status === 'pending') {
        return {
          type: 'STATUS',
          status,
          message: 'Your mentor application is under review',
        };
      }

      if (status === 'correction_required') {
        return {
          type: 'STATUS',
          status,
          message: 'Corrections required before approval',
          feedback: existingMentor.mentorFeedback.current,
        };
      }

      if (status === 'rejected') {
        return {
          type: 'STATUS',
          status,
          message: 'Your mentor application was rejected',
          feedback: existingMentor.mentorFeedback.current,
        };
      }
    }

    const mentor = await this.mentorRepo.create(
      new Mentor(
        undefined,
        userId,
        mentorData.primarySkill,
        mentorData.expertise ?? [],
        mentorData.skillProficiency ?? 1,
        mentorData.yearsExperience ?? 0,
        mentorData.about ?? '',
        {
          bio: mentorData.profile?.bio ?? '',
          avatar: mentorData.profile?.avatar,
        },
        mentorData.socialLinks ?? {},
        // mentorData.documents ?? {},
        {
          identificationDoc: mentorData.documents?.identificationDoc
            ? {
                ...mentorData.documents.identificationDoc,
                uploadedAt:
                  mentorData.documents.identificationDoc.uploadedAt ??
                  new Date(),
              }
            : undefined,

          educationalDoc: mentorData.documents?.educationalDoc
            ? {
                ...mentorData.documents.educationalDoc,
                uploadedAt:
                  mentorData.documents.educationalDoc.uploadedAt ?? new Date(),
              }
            : undefined,

          professionalDoc: mentorData.documents?.professionalDoc
            ? {
                ...mentorData.documents.professionalDoc,
                uploadedAt:
                  mentorData.documents.professionalDoc.uploadedAt ?? new Date(),
              }
            : undefined,

          additionalDoc: mentorData.documents?.additionalDoc
            ? {
                ...mentorData.documents.additionalDoc,
                uploadedAt:
                  mentorData.documents.additionalDoc.uploadedAt ?? new Date(),
              }
            : undefined,
        },
        0,
        0,
        [],
        0,
        [],
        false,
        mentorData.communicationPref,
        mentorData.hourlyRate,
      ),
    );

    return {
      type: 'CREATED',
      status: mentor.mentorStatus,
      message: 'Mentor application submitted successfully',
      mentorId: mentor._id!,
    };
  }
}
