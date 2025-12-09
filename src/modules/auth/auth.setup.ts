import type { IUserRepository } from '../users/domain/repositories/users-repository.interface';
import type { IPasswordService } from 'src/core/common/security/password-hasher.interface';
import type { ITokenService } from './application/interfaces/token-service.interface';
import type { IRefreshTokenRepository } from './domain/repositories/refresh-token-repository.interface';

import { LoginUseCase } from './application/usecases/login.usecase';
import { Logger } from 'winston';
import { LogOutUseCase } from './application/usecases/logout.usecase';
import { IMailService } from 'src/core/common/mail/mail.interface';
import { SendVerificationMailUseCase } from './application/usecases/send-verification-mail.usecase';
import { ConfigService } from '@nestjs/config';
import { VerifyEmailUsecase } from './application/usecases/verify-email.usecase';

export interface AuthUseCases {
  login: LoginUseCase;
  logout: LogOutUseCase;
  sendVerificationMail: SendVerificationMailUseCase;
  verifyEmail: VerifyEmailUsecase;
}

export const AuthSetup = {
  create(
    userRepo: IUserRepository,
    passwordService: IPasswordService,
    tokenService: ITokenService,
    refreshTokenRepo: IRefreshTokenRepository,
    mailService: IMailService,
    configService: ConfigService,
    logger: Logger,
  ): AuthUseCases {
    // login
    const login = new LoginUseCase(
      userRepo,
      passwordService,
      tokenService,
      refreshTokenRepo,
      logger,
    );

    // logout
    const logout = new LogOutUseCase(tokenService, refreshTokenRepo, logger);

    // send email
    const sendVerificationMail = new SendVerificationMailUseCase(
      tokenService,
      userRepo,
      mailService,
      configService,
      logger,
    );

    // verify mail
    const verifyEmail = new VerifyEmailUsecase(tokenService, userRepo, logger);

    // forgot password
    // const forgotPassword = new ForgotPasswordUsecase(
    //   tokenService,
    //   userRepo,
    //   mailService,
    //   configService,
    //   logger,
    // );

    return { login, logout, sendVerificationMail, verifyEmail };
  },
};
