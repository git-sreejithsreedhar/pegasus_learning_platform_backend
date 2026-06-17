import { JwtTokenService } from '../../infrastructure/jwt/jwt.service';
import { TOKEN_SERVICE } from '../tokens';

export const TokenServiceProvider = {
  provide: TOKEN_SERVICE,
  useClass: JwtTokenService,
};
