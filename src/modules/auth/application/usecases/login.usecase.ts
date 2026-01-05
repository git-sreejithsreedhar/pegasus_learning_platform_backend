import { IPasswordService } from 'src/core/common/security/password-hasher.interface';
import { User } from 'src/modules/users/domain/entities/users.entity';
import { IUserRepository } from 'src/modules/users/domain/repositories/users-repository.interface';
import { Email } from 'src/shared/domain/valueobjects/email';
import { Password } from 'src/shared/domain/valueobjects/password';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { IRefreshTokenRepository } from '../../domain/repositories/refresh-token-repository.interface';
import { ILoginUsecase } from '../interfaces/auth-usecase.interface';
import { ITokenService } from '../interfaces/token-service.interface';
import { Logger } from 'winston';
import { UserNotFoundError } from 'src/modules/users/domain/errors/user-not-found-error';
import { UserBlockedError } from 'src/modules/users/domain/errors/user-blocked-error';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';

export class LoginUseCase implements ILoginUsecase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly tokenService: ITokenService,
    private readonly refreshTokenRepo: IRefreshTokenRepository,
    private readonly logger: Logger,
  ) {}

  async execute(
    email: string,
    password: string,
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    this.logger.info(`Login attempt for ${email}`);

    const emailVO = Email.create(email);
    const passwordVO = Password.create(password);

    const user = await this.userRepo.findByEmail(emailVO.value);

    if (!user) {
      throw new UserNotFoundError();
    }

    if (user.isBlocked) {
      throw new UserBlockedError();
    }

    // if (!user.isEmailVerified) {
    //   this.logger.warn(`Login failed - email not verified: ${email}`);
    //   throw new EmailNotVerifiedError();
    // throw new HttpException(
    //   ResponseConstants.MAIL_NOT_VERIFIED.message,
    //   ResponseConstants.MAIL_NOT_VERIFIED.statusCode,
    // );
    // }

    const isValid = await this.passwordService.compare(
      passwordVO.stringValue,
      user.password,
    );

    if (!isValid) {
      throw new InvalidCredentialsError();
    }

    user.lastLogin = new Date();
    await this.userRepo.update(user);

    // Generate Tokens
    const tokens = await this.tokenService.generateTokenPair({
      userId: user._id,
      email: user.email,
      roles: user.roles,
    });

    // Hash Refresh Token
    const hashedRefreshToken = await this.passwordService.hash(
      tokens.refreshToken,
    );

    const refreshTokenEntity = new RefreshToken(
      user._id,
      hashedRefreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      new Date(),
    );

    await this.refreshTokenRepo.saveRefreshToken(refreshTokenEntity);

    this.logger.info(`Login success for ${email}`);

    return { user, ...tokens };
  }
}
