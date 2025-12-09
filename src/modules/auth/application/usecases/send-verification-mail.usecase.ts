import { IUserRepository } from 'src/modules/users/domain/repositories/users-repository.interface';
import { ITokenService } from '../interfaces/token-service.interface';
import { Logger } from 'winston';
import { IMailService } from 'src/core/common/mail/mail.interface';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISendVerificationMailUsecase } from '../interfaces/auth-usecase.interface';

export class SendVerificationMailUseCase
  implements ISendVerificationMailUsecase
{
  constructor(
    private readonly tokenService: ITokenService,
    private readonly userRepo: IUserRepository,
    private readonly mailService: IMailService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  async execute(user: {
    _id: string;
    email: string;
    name?: string;
  }): Promise<void> {
    try {
      // const frontendUrl = this.configService.get<string>('app.frontend');
      const config = this.configService.get<{ frontendUrl: string }>(
        'app.frontend',
      );
      const frontendUrl = config?.frontendUrl;

      if (!frontendUrl) {
        throw new InternalServerErrorException('frontend url not found');
      }

      const token = await this.tokenService.createEmailVerificationToken({
        userId: user._id,
        email: user.email,
      });

      if (typeof token !== 'string') {
        throw new InternalServerErrorException('Token generation failed');
      }

      const verificationLink = `${frontendUrl}/auth/verify-email?token=${token}`;
      console.log('link :', verificationLink);
      await this.mailService.sendVerificationMail(
        user.email,
        verificationLink,
        user.name || '',
      );

      this.logger.info(`Verification Mail sent to ${user.email}`);
    } catch (error) {
      this.logger.error(`Failed to send verification mail to ${user?.email}`, {
        error: error instanceof Error ? error.message : error,
      });

      throw new InternalServerErrorException(
        'Unable to send verification mail',
      );
    }
  }
}
