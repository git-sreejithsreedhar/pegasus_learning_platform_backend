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

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: tokenServiceInterface.ITokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req =
      context.getType() === 'http'
        ? context.switchToHttp().getRequest()
        : GqlExecutionContext.create(context).getContext().req;

    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('No token provided');

    const token = authHeader.split(' ')[1];
    if (!token) throw new UnauthorizedException('Invalid token');

    const result = await this.tokenService.verifyAccessToken(token);
    if (!result.isValid) throw new UnauthorizedException(result.error);

    req.user = result.payload;
    return true;
  }
}
