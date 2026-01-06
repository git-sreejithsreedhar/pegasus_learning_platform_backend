import { Logger } from 'winston';
import * as mentorRepositoryInterface from '../../domain/interface/mentor.repository.interface';
import { IRejectMentorUsecase } from '../../domain/interface/usecases.interface';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Inject } from '@nestjs/common';
import { MENTOR_REPOSITORY_TOKEN } from '../../domain/tokens/injection-tokens.constant';

export class RejectMentorUsecase implements IRejectMentorUsecase {
  constructor(
    @Inject(MENTOR_REPOSITORY_TOKEN)
    private readonly mentorRepo: mentorRepositoryInterface.IMentorRepository,

    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}
  async execute(mentorId: string, reason: string): Promise<void> {
    const mentor = await this.mentorRepo.findById(mentorId);

    if (!mentor) {
      this.logger.error(`Mentor not found: ${mentorId}`);
      throw new Error('Mentor no found');
    }

    mentor.reject(reason);

    await this.mentorRepo.update(mentor);
  }
}
