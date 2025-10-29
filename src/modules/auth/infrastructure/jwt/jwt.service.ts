import { Injectable } from '@nestjs/common';
import {
  GeneratedTokens,
  TokenPayload,
  TokenService,
  TokenVerificationResult,
} from '../../application/token-service.interface';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { ConfigValidationService } from 'src/core/config/config-validation.service';

export interface JWTConfifg {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
  issuer: string;
}

@Injectable()
export class JwtTokenService implements TokenService {
  private readonly tokenConfig: JWTConfifg;

  constructor(
    private readonly configValidaionService: ConfigValidationService,
    private readonly jwtService: JwtService,
  ) {
    this.tokenConfig = this.configValidaionService.validateTokenConfig();
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

  private getAccessTokenVerifyOptions(): JwtVerifyOptions {
    return {
      secret: this.tokenConfig.accessTokenSecret,
      issuer: this.tokenConfig.issuer,
    };
  }

  private getRefreshTokenVerifyOptions(): JwtVerifyOptions {
    return {
      secret: this.tokenConfig.refreshTokenSecret,
      issuer: this.tokenConfig.issuer,
    };
  }

  async generateAccessToken(payload: object): Promise<string> {
    try {
      return await this.jwtService.signAsync(
        payload,
        this.getAccessTokenOptions(),
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate access token: ${error.message}`);
      }
      throw new Error(`Failed to generate access token`);
    }
  }

  async generateRefreshToken(payload: object): Promise<string> {
    try {
      return await this.jwtService.signAsync(
        payload,
        this.getRefreshTokenOptions(),
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate access token: ${error.message}`);
      }
      throw new Error(`Failed to generate access token`);
    }
  }

  async generateTokenPair(payload: object): Promise<GeneratedTokens> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.generateAccessToken(payload),
        this.generateRefreshToken(payload),
      ]);
      return { accessToken, refreshToken };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate tokens: ${error.message}`);
      }
      throw new Error(`Failed to generate access tokens.`);
    }
  }

  async verifyAccessToken(token: string): Promise<TokenVerificationResult> {
    return this.verifyToken(token, this.getAccessTokenVerifyOptions());
  }

  async verifyRefreshToken(token: string): Promise<TokenVerificationResult> {
    return this.verifyToken(token, this.getRefreshTokenOptions());
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
      return {
        isValid: true,
        payload: payload,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { isValid: false, error: error.message };
      }
      return { isValid: false, error: 'Unknown verification error' };
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
