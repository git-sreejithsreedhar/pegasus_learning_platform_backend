import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as tokenServiceInterface from 'src/modules/auth/application/interfaces/token-service.interface';
import { TOKEN_SERVICE } from 'src/modules/auth/application/tokens';
import type { Request } from 'express';

type AuthenticatedRequest = Request & {
  user?: Express.User;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: tokenServiceInterface.ITokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req =
      context.getType() === 'http'
        ? context.switchToHttp().getRequest<AuthenticatedRequest>()
        : GqlExecutionContext.create(context).getContext<{
            req: AuthenticatedRequest;
          }>().req;

    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('No token provided');

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : undefined;
    if (!token) throw new UnauthorizedException('Invalid token');

    const result = await this.tokenService.verifyAccessToken(token);
    if (!result.isValid || !result.payload) {
      throw new UnauthorizedException(result.error ?? 'Invalid token');
    }

    req.user = {
      userId: result.payload.userId,
      email: result.payload.email ?? '',
      role: result.payload.role ?? '',
      iat: result.payload.iat,
      exp: result.payload.exp,
    };
    return true;
  }
}
