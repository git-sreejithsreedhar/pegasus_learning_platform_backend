import { Inject, NotFoundException } from '@nestjs/common';
import { IApproveMentorUsecase } from '../IUseCase/usecases.interface';
import * as mentorRepositoryInterface from '../../domain/interface/mentor.repository.interface';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { MENTOR_REPOSITORY_TOKEN } from '../../domain/tokens/injection-tokens.constant';
import * as usersRepositoryInterface from 'src/modules/users/domain/repositories/users-repository.interface';
import { USER_REPOSITORY } from 'src/modules/users/domain/tokens/tokens';
import { UserRole } from 'src/modules/users/domain/entities/users.entity';

export class ApproveMentorUseCase implements IApproveMentorUsecase {
  constructor(
    @Inject(MENTOR_REPOSITORY_TOKEN)
    private readonly mentorRepo: mentorRepositoryInterface.IMentorRepository,

    @Inject(USER_REPOSITORY)
    private readonly userRepo: usersRepositoryInterface.IUserRepository,

    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}
  async execute(mentorId: string): Promise<void> {
    const mentor = await this.mentorRepo.findById(mentorId);

    if (!mentor) {
      this.logger.warn(`Mentor not found: ${mentorId}`);
      throw new Error('Mentor not found');
    }

    mentor.approve();

    const user = await this.userRepo.findById(mentor.userId);
    if (user) {
      user.addRole(UserRole.MENTOR);
    } else {
      throw new NotFoundException('User not found');
    }

    await this.userRepo.update(user);
    await this.mentorRepo.update(mentor);

    this.logger.info(`Mentor approved successfully: ${mentorId}`);
  }
}
