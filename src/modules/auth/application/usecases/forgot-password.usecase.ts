import { IUserRepository } from 'src/modules/users/domain/repositories/users-repository.interface';
import { IForgotPasswordUsecase } from '../interfaces/auth-usecase.interface';
import { ITokenService } from '../interfaces/token-service.interface';
// import { HttpException } from '@nestjs/common';
import { IMailService } from 'src/core/common/mail/mail.interface';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'winston';
import { UserNotFoundError } from 'src/modules/users/domain/errors/user-not-found-error';

export class ForgotPasswordUsecase implements IForgotPasswordUsecase {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly userRepo: IUserRepository,
    private readonly mailService: IMailService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  async execute(email: string): Promise<{ message: string }> {
    const config = this.configService.get<{ frontendUrl: string }>(
      'app.frontend',
    );
    const frontendUrl = config?.frontendUrl;

    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      throw new UserNotFoundError();
    }

    const token = await this.tokenService.createEmailVerificationToken({
      userId: user._id,
      email: user.email,
    });

    const resetLink = `${frontendUrl}/auth/reset-password/?token=${token}`;

    await this.mailService.sendPasswordReset(email, resetLink);

    return { message: 'Password reset mail sent' };
  }
}
