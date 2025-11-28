import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshTokenSchema } from './infrastructure/database/models/mongo-refreshToken.schema';
import { MongoRefreshTokenRepository } from './infrastructure/database/repository/mongo-refresh-token.repository';
import {
  AUTH_USECASES,
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
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './infrastructure/jwt/jwt.strategy';
import { USER_REPOSITORY } from '../users/domain/tokens/tokens';
@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
    UsersModule,
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: 'RefreshToken', schema: RefreshTokenSchema },
    ]),
    ConfigModule.forFeature(appConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],

  providers: [
    JwtStrategy,
    ConfigValidationService,
    // repository for password service
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

    // wiringup usecases
    {
      provide: AUTH_USECASES,
      useFactory: (
        userRepo: IUserRepository,
        passwordService: IPasswordService,
        tokenService: ITokenService,
        refreshTokenRepo: IRefreshTokenRepository,
        logger: Logger,
      ) => {
        return AuthSetup.create(
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
    AuthResolver,
  ],

  exports: [
    REFRESH_TOKEN_REPOSITORY,
    TOKEN_SERVICE,
    AUTH_USECASES,
    PassportModule,
  ],
})
export class AuthModule {}
