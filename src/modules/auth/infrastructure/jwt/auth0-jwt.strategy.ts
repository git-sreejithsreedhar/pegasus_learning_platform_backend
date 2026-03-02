// src/auth/strategies/auth0-jwt.strategy.ts
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { FindOrCreateSocialUser } from 'src/modules/users/application/use-cases/findOrCreateUser.usecase';
import { FIND_OR_CREATE_SOCIAL_USER } from 'src/modules/users/domain/tokens/tokens';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedError } from 'src/core/common/errors/unauthorized-error';

@Injectable()
export class Auth0JwtStrategy extends PassportStrategy(Strategy, 'auth0-jwt') {
  constructor(
    @Inject(FIND_OR_CREATE_SOCIAL_USER)
    private readonly findOrCreateSocialUser: FindOrCreateSocialUser,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Auth0 JWKS URL
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://YOUR_DOMAIN/.well-known/jwks.json`,
      }),
      audience: 'YOUR_API_IDENTIFIER', // your API identifier in Auth0
      issuer: `https://YOUR_DOMAIN/`,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
    name?: string;
    nickname?: string;
    picture?: string;
  }) {
    const user = await this.findOrCreateSocialUser.execute({
      email: payload.email,
      name: payload.nickname ?? payload.name ?? '',
      avatar: payload.picture ?? '',
      auth0Id: payload.sub,
    });

    if (!user) {
      throw new UnauthorizedError('Unable to authenticate user.');
    }

    return user;
  }
}
