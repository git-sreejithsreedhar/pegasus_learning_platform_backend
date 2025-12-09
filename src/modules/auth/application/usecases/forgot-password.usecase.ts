import { IUserRepository } from 'src/modules/users/domain/repositories/users-repository.interface';
import { IForgotPasswordUsecase } from '../interfaces/auth-usecase.interface';
import { ITokenService } from '../interfaces/token-service.interface';
import { HttpException } from '@nestjs/common';
import { IMailService } from 'src/core/common/mail/mail.interface';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'winston';

export class ForgotPasswordUsecase implements IForgotPasswordUsecase {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly userRepo: IUserRepository,
    private readonly mailService: IMailService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  async execute(email: string): Promise<{ message: string }> {
    try {
      const config = this.configService.get<{ frontendUrl: string }>(
        'app.frontend',
      );
      const frontendUrl = config?.frontendUrl;

      const user = await this.userRepo.findByEmail(email);

      if (!user) {
        throw new HttpException('User not found', 404);
      }

      const token = await this.tokenService.createEmailVerificationToken({
        id: user._id,
        email: user.email,
      });

      const resetLink = `${frontendUrl}/auth/forgot-password/?token=${token}`;

      await this.mailService.sendPasswordReset(user.email, resetLink);

      return { message: 'Password reset mail sent' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
