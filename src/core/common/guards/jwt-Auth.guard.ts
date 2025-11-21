// import { ExecutionContext, HttpException } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { ResponseConstants } from '../constants/response.constants';
// import { Logger } from 'winston';

// export class JwtAuthGuad extends AuthGuard('jwt') {
//   constructor(logger: Logger) {}
//   handleRequest<TUser = any>(
//     err: any,
//     user: any,
//     info: any,
//     context: ExecutionContext,
//     status?: any,
//   ): TUser {
//     if (err || !user) {
//       this.logger.error('Token Invalid');
//       throw new HttpException(
//         ResponseConstants.TOKEN_INVALID.message,
//         ResponseConstants.TOKEN_INVALID.statusCode,
//       );
//     }
//     return user;
//   }
// }

import { HttpException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Logger } from 'winston';
import { ResponseConstants } from '../constants/response.constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly logger: Logger) {
    super();
  }

  override handleRequest<TUser = unknown>(
    err: Error | null,
    user: TUser | null,
    info: string,
    // _context: ExecutionContext,
  ): TUser {
    // Extract useful message from Passport's 'info'
    // const infoMessage =
    //   (info)?.message ||
    //   (info instanceof Error ? info.message : info ? String(info) : null);

    if (err || !user) {
      this.logger.error('Token Invalid :', `${info}`);

      throw new HttpException(
        ResponseConstants.TOKEN_INVALID.message,
        ResponseConstants.TOKEN_INVALID.statusCode,
      );
    }

    return user;
  }
}
