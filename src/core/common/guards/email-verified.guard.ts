// import {
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
//   Injectable,
// } from '@nestjs/common';
// import { GqlExecutionContext } from '@nestjs/graphql';
// import { Request } from 'express';

// interface RequestWithUser extends Request {
//   user?: {
//     emailVerified?: boolean;
//   };
// }

// @Injectable()
// export class EmailVerifiedGuard implements CanActivate {
//   canActivate(context: ExecutionContext): boolean {
//     const req = this.getRequest(context);
//     const user = req.user;

//     if (!user) {
//       throw new ForbiddenException('User not authenticated');
//     }

//     if (!user.emailVerified) {
//       throw new ForbiddenException('Email is not verified');
//     }

//     return true;
//   }

//   private getRequest(context: ExecutionContext): RequestWithUser {
//     if (context.getType() === 'http') {
//       return context.switchToHttp().getRequest<RequestWithUser>();
//     }

//     const gqlCtx = GqlExecutionContext.create(context);
//     return gqlCtx.getContext<{ req: RequestWithUser }>().req;
//   }
// }

// //@UseGuards(JwtAuthGuard, EmailVerifiedGuard)
