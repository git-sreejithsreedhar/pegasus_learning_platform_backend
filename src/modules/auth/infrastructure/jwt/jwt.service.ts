import { Injectable } from '@nestjs/common';
import {
  GeneratedTokens,
  TokenPayload,
  ITokenService,
  TokenVerificationResult,
} from '../../application/interfaces/token-service.interface';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { ConfigValidationService } from 'src/core/config/config-validation.service';

export interface JWTConfig {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  mailVerificationTokenSecret: string;

  accessTokenExpiry: string;
  refreshTokenExpiry: string;
  mailVerificationTokenExpiry: string;

  issuer: string;
}

@Injectable()
export class JwtTokenService implements ITokenService {
  private readonly tokenConfig: JWTConfig;

  constructor(
    private readonly configValidationService: ConfigValidationService,
    private readonly jwtService: JwtService,
  ) {
    this.tokenConfig = this.configValidationService.validateTokenConfig();
  }

  private getAccessTokenOptions(): JwtSignOptions {
    return {
      secret: this.tokenConfig.accessTokenSecret,
      expiresIn: this.tokenConfig.accessTokenExpiry,
      issuer: this.tokenConfig.issuer,
    };
  }

  private getRefreshTokenOptions(): JwtSignOptions {
    return {
      secret: this.tokenConfig.refreshTokenSecret,
      expiresIn: this.tokenConfig.refreshTokenExpiry,
      issuer: this.tokenConfig.issuer,
    };
  }

  private getMailVerificationTokenOptions(): JwtSignOptions {
    return {
      secret: this.tokenConfig.mailVerificationTokenSecret,
      expiresIn: this.tokenConfig.mailVerificationTokenExpiry,
      issuer: this.tokenConfig.issuer,
    };
  }

  private getMailVerificationVerifyOptions(): JwtVerifyOptions {
    return {
      secret: this.tokenConfig.mailVerificationTokenSecret,
      issuer: this.tokenConfig.issuer,
    };
  }

  async generateAccessToken(payload: object): Promise<string> {
    return this.jwtService.signAsync(payload, this.getAccessTokenOptions());
  }

  async generateRefreshToken(payload: object): Promise<string> {
    return this.jwtService.signAsync(payload, this.getRefreshTokenOptions());
  }

  async createEmailVerificationToken(payload: object): Promise<string> {
    return this.jwtService.signAsync(
      payload,
      this.getMailVerificationTokenOptions(),
    );
  }

  async generateTokenPair(payload: object): Promise<GeneratedTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);
    return { accessToken, refreshToken };
  }

  async verifyAccessToken(token: string): Promise<TokenVerificationResult> {
    return this.verifyToken(token, this.getAccessTokenOptions());
  }

  async verifyRefreshToken(token: string): Promise<TokenVerificationResult> {
    return this.verifyToken(token, this.getRefreshTokenOptions());
  }

  async verifyEmailVerificationToken(
    token: string,
  ): Promise<TokenVerificationResult> {
    return this.verifyToken(token, this.getMailVerificationVerifyOptions());
  }

  private async verifyToken(
    token: string,
    options: JwtVerifyOptions,
  ): Promise<TokenVerificationResult> {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(
        token,
        options,
      );
      return { isValid: true, payload };
    } catch (error: unknown) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

//   async revokeToken(token: string): Promise<void> {
//     try {
//         await
//     } catch (error: unknown) {
//       throw new BadRequestException();
//     }
//   }

// }
