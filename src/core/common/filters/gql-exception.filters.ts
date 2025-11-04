// import { Catch, ArgumentsHost, Inject } from '@nestjs/common';
// import { GqlExceptionFilter } from '@nestjs/graphql';
// import { ApolloError } from 'apollo-server-express';
// import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
// import { Logger } from 'winston';
// import { ResponseConstants } from '../constants/response.constants';

// @Catch()
// export class GqlAllExceptionFilter implements GqlExceptionFilter {
//   constructor(
//     @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
//   ) {}

//   catch(exception: any, host: ArgumentsHost) {
//     const gqlHost = host.switchToGql();
//     const context = gqlHost.getContext();
//     const request = context.req;

//     const status = exception?.status || 500;
//     const message =
//       exception?.message || ResponseConstants.SERVER_ERROR.message;

//     // Log the error
//     this.logger.error(`[GraphQL] ${message}`, {
//       path: request?.body?.operationName,
//       stack: exception?.stack,
//     });

//     // Return Apollo-compatible error
//     return new ApolloError(message, status.toString());
//   }
// }

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { GraphQLResolveInfo } from 'graphql';
import { Request } from 'express';

export interface GqlContext {
  req: Request;
  user?: unknown;
}

@Catch()
export class GqlAllExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo<GraphQLResolveInfo>();
    const fieldName = info?.fieldName ?? 'unknown';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as { message?: string | string[] };
      message = Array.isArray(res?.message)
        ? res.message.join(', ')
        : res?.message || exception.message;
    }

    // Log the GraphQL error
    this.logger.error(`[GraphQL] ${message}`, {
      status,
      path: fieldName,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    // Standardized GraphQL error format
    throw new HttpException(
      {
        errors: [
          {
            message,
            extensions: { code: String(status) },
          },
        ],
        data: null,
      },
      status,
    );
  }
}
