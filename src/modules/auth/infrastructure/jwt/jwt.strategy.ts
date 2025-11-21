import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from 'src/modules/users/domain/entities/users.entity';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole[];
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('app.accessToken.secret');
    if (!secret) {
      throw new Error(
        'ACCESS_TOKEN_SECRET must be defined in environment variables',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  validate(payload: JwtPayload) {
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };
  }
}
