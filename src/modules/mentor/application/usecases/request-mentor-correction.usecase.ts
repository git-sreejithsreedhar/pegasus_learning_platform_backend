import { Logger } from 'winston';
import { IMentorRepository } from '../../domain/interface/mentor.repository.interface';
import { IRequestMentorCorrectionUsecase } from '../../domain/interface/usecases.interface';

export class RequestMentorCorrectionUsecase
  implements IRequestMentorCorrectionUsecase
{
  constructor(
    private readonly mentorRepo: IMentorRepository,
    private readonly logger: Logger,
  ) {}

  async execute(mentorId: string, message: string): Promise<void> {
    const mentor = await this.mentorRepo.findById(mentorId);
    if (!mentor) throw new Error('Mentor not found');

    mentor.requestCorrection(message);

    await this.mentorRepo.update(mentor);

    this.logger.info('Mentor correction requested', { mentorId });
  }
}
