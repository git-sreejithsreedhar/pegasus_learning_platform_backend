import type { IUserRepository } from '../users/domain/repositories/users-repository.interface';
import type { IPasswordService } from 'src/core/common/security/password-hasher.interface';
import type { ITokenService } from './application/interfaces/token-service.interface';
import type { IRefreshTokenRepository } from './domain/repositories/refresh-token-repository.interface';

import { LoginUseCase } from './application/usecases/login.usecase';
import { Logger } from 'winston';
import { LogOutUseCase } from './application/usecases/logout.usecase';

export interface AuthUseCases {
  login: LoginUseCase;
  logout: LogOutUseCase;
}

export const AuthSetup = {
  create(
    userRepo: IUserRepository,
    passwordService: IPasswordService,
    tokenService: ITokenService,
    refreshTokenRepo: IRefreshTokenRepository,
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

    return { login, logout };
  },
};
