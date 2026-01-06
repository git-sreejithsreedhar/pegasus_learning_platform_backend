import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshTokenSchema } from './infrastructure/database/models/mongo-refreshToken.schema';
import { MongoRefreshTokenRepository } from './infrastructure/database/repository/mongo-refresh-token.repository';
import {
  AUTH_USECASES,
  IForgotPasswordUsecaseToken,
  ILoginUsecaseToken,
  IResendEmailUsecaseToken,
  ISendVerificationMailUsecaseToken,
  IUpdatePasswordUsecaseToken,
  IVerifyMailUsecaseToken,
  PASSWORD_SERVICE,
  REFRESH_TOKEN_REPOSITORY,
  TOKEN_SERVICE,
} from './application/tokens';
import { JwtModule } from '@nestjs/jwt';
import { JwtTokenService } from './infrastructure/jwt/jwt.service';
import { ConfigValidationService } from 'src/core/config/config-validation.service';
import { UsersModule } from '../users/users.module';
import { AuthSetup } from './auth.setup';
import { BcryptPasswordHasher } from 'src/core/common/security/bcrypt-password-hasher.service';
import { IUserRepository } from '../users/domain/repositories/users-repository.interface';
import { IPasswordService } from 'src/core/common/security/password-hasher.interface';
import { ITokenService } from './application/interfaces/token-service.interface';
import { IRefreshTokenRepository } from './domain/repositories/refresh-token-repository.interface';
import { AuthResolver } from './presentation/auth.resolver';
import { WINSTON_MODULE_PROVIDER, WinstonModule } from 'nest-winston';
import { Logger } from 'winston';
import { winstonConfig } from 'src/core/config/logger.config';
import { APP_FILTER } from '@nestjs/core';
import { GqlHttpExceptionFilter } from 'src/core/common/filters/gql-exception.filters';
import appConfig from 'src/core/config/env.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './infrastructure/jwt/jwt.strategy';
import { USER_REPOSITORY } from '../users/domain/tokens/tokens';
import { MailModule } from 'src/core/common/mail/mail.module';
import { IMailService } from 'src/core/common/mail/mail.interface';
import { IMailServiceToken } from 'src/core/common/mail/mail.constant';
import { SendVerificationMailUseCase } from './application/usecases/send-verification-mail.usecase';
import { AuthController } from './presentation/controller/auth.controller';
import { VerifyEmailUsecase } from './application/usecases/verify-email.usecase';
import { LoginUseCase } from './application/usecases/login.usecase';
import { VERIFICATION_TRIGGER } from '../users/application/interfaces/verification-trigger.interface';
import { ResendEmailUsecase } from './application/usecases/resend-email.usecase';
import { ForgotPasswordUsecase } from './application/usecases/forgot-password.usecase';
import { UpdatePasswordUsecase } from './application/usecases/update-password.usecase';
import { JwtAuthGuard } from 'src/core/common/guards/jwt-Auth.guard';
import { TokenServiceProvider } from './application/providers/token-providers';

@Module({
  controllers: [AuthController],
  imports: [
    WinstonModule.forRoot(winstonConfig),
    // UsersModule,
    forwardRef(() => UsersModule),
    MailModule,
    JwtModule.register({}),
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([
      { name: 'RefreshToken', schema: RefreshTokenSchema },
    ]),
    ConfigModule.forFeature(appConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],

  providers: [
    TokenServiceProvider,
    JwtStrategy,
    ConfigValidationService,
    // repository for password service
    SendVerificationMailUseCase,
    // {
    //   provide: VERIFICATION_TRIGGER,
    //   useClass: SendVerificationMailUseCase,
    // },
    {
      provide: JwtAuthGuard,
      useClass: JwtAuthGuard,
    },
    {
      provide: VERIFICATION_TRIGGER,
      useExisting: ISendVerificationMailUsecaseToken,
    },

    {
      provide: PASSWORD_SERVICE,
      useClass: BcryptPasswordHasher,
    },

    // repository for refresh tokens
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: MongoRefreshTokenRepository,
    },

    // token service for access token and refresh token
    {
      provide: TOKEN_SERVICE,
      useClass: JwtTokenService,
    },
    {
      provide: APP_FILTER,
      useClass: GqlHttpExceptionFilter,
    },
    {
      provide: PASSWORD_SERVICE,
      useClass: BcryptPasswordHasher,
    },
    // {
    //   provide: ISendVerificationMailUsecaseToken,
    //   useClass: SendVerificationMailUseCase,
    // },
    // send-verification-mail
    {
      provide: ISendVerificationMailUsecaseToken,
      useFactory: (
        tokenService: ITokenService,
        userRepo: IUserRepository,
        mailService: IMailService,
        configService: ConfigService,
        logger: Logger,
      ) => {
        return new SendVerificationMailUseCase(
          tokenService,
          userRepo,
          mailService,
          configService,
          logger,
        );
      },
      inject: [
        TOKEN_SERVICE,
        USER_REPOSITORY,
        IMailServiceToken,
        ConfigService,
        WINSTON_MODULE_PROVIDER,
      ],
    },

    // login
    {
      provide: ILoginUsecaseToken,
      useFactory: (
        userRepo: IUserRepository,
        passwordService: IPasswordService,
        tokenService: ITokenService,
        refreshTokenRepo: IRefreshTokenRepository,
        logger: Logger,
      ) => {
        return new LoginUseCase(
          userRepo,
          passwordService,
          tokenService,
          refreshTokenRepo,
          logger,
        );
      },
      inject: [
        USER_REPOSITORY,
        PASSWORD_SERVICE,
        TOKEN_SERVICE,
        REFRESH_TOKEN_REPOSITORY,
        WINSTON_MODULE_PROVIDER,
      ],
    },

    // verify email
    {
      provide: IVerifyMailUsecaseToken,
      useFactory: (
        tokenService: ITokenService,
        userRepo: IUserRepository,
        logger: Logger,
      ) => {
        return new VerifyEmailUsecase(tokenService, userRepo, logger);
      },
      inject: [TOKEN_SERVICE, USER_REPOSITORY, WINSTON_MODULE_PROVIDER],
    },

    // resend email
    {
      provide: IResendEmailUsecaseToken,
      useFactory: (
        tokenService: ITokenService,
        userRepo: IUserRepository,
        mailService: IMailService,
        configService: ConfigService,
        logger: Logger,
      ) => {
        return new ResendEmailUsecase(
          tokenService,
          userRepo,
          mailService,
          configService,
          logger,
        );
      },
      inject: [
        TOKEN_SERVICE,
        USER_REPOSITORY,
        IMailServiceToken,
        ConfigService,
        WINSTON_MODULE_PROVIDER,
      ],
    },
    // forgot password
    {
      provide: IForgotPasswordUsecaseToken,
      useFactory: (
        tokenService: ITokenService,
        userRepo: IUserRepository,
        mailService: IMailService,
        configService: ConfigService,
        logger: Logger,
      ) => {
        return new ForgotPasswordUsecase(
          tokenService,
          userRepo,
          mailService,
          configService,
          logger,
        );
      },
      inject: [
        TOKEN_SERVICE,
        USER_REPOSITORY,
        IMailServiceToken,
        ConfigService,
        WINSTON_MODULE_PROVIDER,
      ],
    },
    // update password
    {
      provide: IUpdatePasswordUsecaseToken,
      useFactory: (
        tokenService: ITokenService,
        userRepo: IUserRepository,
        passwordService: IPasswordService,
        logger: Logger,
      ) => {
        return new UpdatePasswordUsecase(
          tokenService,
          userRepo,
          passwordService,
          logger,
        );
      },
      inject: [
        TOKEN_SERVICE,
        USER_REPOSITORY,
        PASSWORD_SERVICE,
        WINSTON_MODULE_PROVIDER,
      ],
    },

    // wiringup usecases
    {
      provide: AUTH_USECASES,
      useFactory: (
        userRepo: IUserRepository,
        passwordService: IPasswordService,
        tokenService: ITokenService,
        refreshTokenRepo: IRefreshTokenRepository,
        mailService: IMailService,
        configService: ConfigService,
        logger: Logger,
      ) => {
        return AuthSetup.create(
          userRepo,
          passwordService,
          tokenService,
          refreshTokenRepo,
          mailService,
          configService,
          logger,
        );
      },

      inject: [
        USER_REPOSITORY,
        PASSWORD_SERVICE,
        TOKEN_SERVICE,
        REFRESH_TOKEN_REPOSITORY,
        IMailServiceToken,
        ConfigService,
        WINSTON_MODULE_PROVIDER,
      ],
    },
    AuthResolver,
  ],

  exports: [
    REFRESH_TOKEN_REPOSITORY,
    TOKEN_SERVICE,
    AUTH_USECASES,
    PassportModule,
    JwtStrategy,
    VERIFICATION_TRIGGER,
    JwtAuthGuard,
    TokenServiceProvider,
  ],
})
export class AuthModule {}
