import { IUserRepository } from 'src/modules/users/domain/repositories/users-repository.interface';
import { IVerifyMailUsecase } from '../interfaces/auth-usecase.interface';
import { ITokenService } from '../interfaces/token-service.interface';
import { Logger } from 'winston';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export class VerifyEmailUsecase implements IVerifyMailUsecase {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly userRepo: IUserRepository,
    private logger: Logger,
  ) {}
  async execute(token: string): Promise<void> {
    try {
      const data = await this.tokenService.verifyEmailVerificationToken(token);

      const userId = data?.payload?.userId;
      if (!userId) {
        throw new BadRequestException('Invalid token: missing userId');
      }
      const isUser = await this.userRepo.findById(userId);

      if (!isUser) {
        throw new UnauthorizedException('User not found');
      }

      await this.userRepo.updateEmailVerified(userId);

      return;
    } catch (error) {
      console.error(error);
    }
  }
}
