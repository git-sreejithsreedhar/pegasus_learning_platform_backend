import { IUserRepository } from 'src/modules/users/domain/repositories/users-repository.interface';
import { IResendEmailUsecase } from '../interfaces/auth-usecase.interface';
import { ITokenService } from '../interfaces/token-service.interface';
import { IMailService } from 'src/core/common/mail/mail.interface';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';
import { Logger } from 'winston';

// tokenService, userRepo, mailService, configService, logger
export class ResendEmailUsecase implements IResendEmailUsecase {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly userRepo: IUserRepository,
    private readonly mailService: IMailService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}
  async execute(email: string): Promise<void> {
    try {
      const config = this.configService.get<{ frontendUrl: string }>(
        'app.frontend',
      );
      const frontendUrl = config?.frontendUrl;

      if (!frontendUrl) {
        throw new InternalServerErrorException('frontend url not found');
      }

      const user = await this.userRepo.findByEmail(email);

      if (!user) {
        throw new InternalServerErrorException('User not found');
      }

      const token = await this.tokenService.createEmailVerificationToken({
        userId: user._id,
        email: email,
      });

      const verificationLink = `${frontendUrl}/auth/verify-email?token=${token}&email=${encodeURIComponent(user.email)};`;

      await this.mailService.sendVerificationMail(
        user.email,
        verificationLink,
        user.profile.name,
      );
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Unable to send verification mail',
      );
    }
  }
}
