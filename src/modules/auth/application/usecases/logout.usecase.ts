import type { IRefreshTokenRepository } from '../../domain/repositories/refresh-token-repository.interface';
import { ILogOut } from '../interfaces/auth-usecase.interface';
import type { ITokenService } from '../interfaces/token-service.interface';
import { Logger } from 'winston';

export class LogOutUseCase implements ILogOut {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly logger: Logger,
  ) {}

  async execute(refreshToken: string): Promise<void> {
    try {
      await this.tokenService.verifyRefreshToken(refreshToken);

      await this.refreshTokenRepository.clearRefreshToken(refreshToken);
    } catch (error) {
      this.logger.warn(
        'Logout failed to process refresh token deletion, continuing logout flow.',
        {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          refreshTokenAttempted: refreshToken,
        },
      );
    }
  }
}
