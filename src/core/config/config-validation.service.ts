import { ConfigService } from '@nestjs/config';
import { AppConfig, TokenConfig } from './config.interface';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ConfigValidationService {
  constructor(private readonly configService: ConfigService) {}

  validateAppConfig(): AppConfig {
    const config = this.configService.get<AppConfig>('app');

    if (!config) {
      throw new BadRequestException('Application Configuration Not Found.');
    }

    this.validateTokenConfig();
    this.validateDatabaseConfig(config);
    this.validateMailConfig(config);

    return config;
  }

  validateTokenConfig(): TokenConfig {
    const accessToken =
      this.configService.get<AppConfig['accessToken']>('app.accessToken');
    const refreshToken =
      this.configService.get<AppConfig['refreshToken']>('app.refreshToken');
    const mailVerificationToken = this.configService.get<
      AppConfig['mailVerificationToken']
    >('app.mailVerificationToken');

    if (!accessToken?.secret) {
      throw new BadRequestException('JWT_ACCESS_TOKEN_SECRET is required');
    }

    if (!refreshToken?.secret) {
      throw new BadRequestException('JWT_REFRESH_TOKEN_SECRET is required');
    }

    if (!mailVerificationToken?.secret) {
      throw new BadRequestException('MAIL_VERIFICATION_SECRET is required');
    }

    return {
      accessTokenSecret: accessToken.secret,
      refreshTokenSecret: refreshToken.secret,
      mailVerificationTokenSecret: mailVerificationToken.secret,
      accessTokenExpiry: accessToken.expiresIn ?? '30m',
      refreshTokenExpiry: refreshToken.expiresIn ?? '7d',
      mailVerificationTokenExpiry: mailVerificationToken.expiresIn ?? '15m',
      issuer: 'pegasus-app',
    };
  }

  validateDatabaseConfig(config: AppConfig): void {
    if (!config.database?.uri) {
      throw new BadRequestException('Database URI is required.');
    }

    if (!config.database?.dbName) {
      throw new BadRequestException('MONGODB_DB_NAME is required');
    }
  }

  validateMailConfig(config: AppConfig): void {
    if (config.nodeEnv === 'production') {
      const mail = config.mail;

      if (!mail.user || !mail.password || !mail.host) {
        throw new BadRequestException(
          'Mail configuration (MAIL_USER, MAIL_PASSWORD, MAIL_HOST) is required in production',
        );
      }
    }
  }

  validateGoogleConfig() {
    const googleId =
      this.configService.get<AppConfig['googleId']>('app.googleId');

    if (!googleId?.id) {
      throw new BadRequestException('GOOGLE_CLIENT_ID is required');
    }

    return { clientId: googleId.id };
  }

  validateFrontendConfig() {
    const frontend =
      this.configService.get<AppConfig['frontend']>('app.frontend');

    if (!frontend?.frontendUrl) {
      throw new BadRequestException('FRONTEND_URL is required');
    }

    return { frontendUrl: frontend.frontendUrl };
  }
}

// import { ConfigService } from '@nestjs/config';
// import { AppConfig, TokenConfig } from './config.interface';
// import { BadRequestException, Injectable } from '@nestjs/common';

// @Injectable()
// export class ConfigValidationService {
//   constructor(private readonly configService: ConfigService) {}

//   validateAppConfig(): AppConfig {
//     const config = this.configService.get<AppConfig>('app');

//     if (!config) {
//       throw new BadRequestException('Application Configuration Not Found.');
//     }

//     this.validateTokenConfig();
//     this.validateDatabaseConfig(config);
//     this.validateMailConfig(config);

//     return config;
//   }

//   validateTokenConfig(): TokenConfig {
//     const accessToken =
//       this.configService.get<AppConfig['accessToken']>('app.accessToken');
//     const refreshToken =
//       this.configService.get<AppConfig['refreshToken']>('app.refreshToken');

//     if (!accessToken?.secret) {
//       throw new BadRequestException('JWT_ACCESS_TOKEN_SECRET is required');
//     }

//     if (!refreshToken?.secret) {
//       throw new BadRequestException('JWT_REFRESH_TOKEN_SECRET is required');
//     }

//     return {
//       accessTokenSecret: accessToken.secret,
//       refreshTokenSecret: refreshToken.secret,
//       accessTokenExpiry: accessToken.expiresIn || '30m',
//       refreshTokenExpiry: refreshToken.expiresIn || '7d',
//       issuer: 'pegasus-app',
//     };
//   }

//   validateDatabaseConfig(config: AppConfig): void {
//     if (!config.database?.uri) {
//       throw new BadRequestException('Database URI is required.');
//     }

//     if (!config.database?.dbName) {
//       throw new BadRequestException('MONGODB_DB_NAME is required');
//     }
//   }

//   validateMailConfig(config: AppConfig): void {
//     if (config.nodeEnv === 'production') {
//       const mail = config.mail;
//       if (!mail?.user || !mail?.password || !mail?.host) {
//         throw new BadRequestException(
//           'Mail configuration (MAIL_USER, MAIL_PASSWORD, MAIL_HOST) is required in production',
//         );
//       }
//     }
//   }

//   validateGoogleConfig(): { clientId: string } {
//     const googleId =
//       this.configService.get<AppConfig['googleId']>('app.googleId');

//     if (!googleId?.id) {
//       throw new BadRequestException(
//         'GOOGLE_CLIENT_ID is required for authentication',
//       );
//     }

//     return { clientId: googleId.id };
//   }

//   validateFrontendConfig(): { frontendUrl: string } {
//     const frontend =
//       this.configService.get<AppConfig['frontend']>('app.frontend');

//     if (!frontend?.frontendUrl) {
//       throw new BadRequestException('FRONTEND_URL is required');
//     }

//     return { frontendUrl: frontend.frontendUrl };
//   }
// }
