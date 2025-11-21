// import { Catch, HttpException, Inject, ArgumentsHost } from '@nestjs/common';
// import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
// import { GraphQLError, GraphQLResolveInfo } from 'graphql';
// import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
// import { Logger } from 'winston';

// @Catch(HttpException)
// export class GqlHttpExceptionFilter implements GqlExceptionFilter {
//   constructor(
//     @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
//   ) {}

//   catch(exception: HttpException, host: ArgumentsHost): GraphQLError {
//     const gqlHost = GqlArgumentsHost.create(host);
//     const status = exception.getStatus();
//     const res = exception.getResponse() as { message?: string | string[] };
//     const message = Array.isArray(res?.message)
//       ? res.message.join(', ')
//       : (res?.message ?? exception.message);
//     // const info = gqlHost.getInfo<GraphQLResolveInfo>();

//     const field = gqlHost.getInfo().fieldName ?? 'unknown';

//     /* ========== SERVER LOG  ========== */
//     this.logger.error('[GraphQL] ' + message, {
//       status,
//       field,
//       stack: exception.stack, // full stack trace
//       originalResponse: res, // whatever the exception carried
//       variables: gqlHost.getArgs(), // query variables (safe in dev)
//     });

//     /* ==========  CLIENT RESPONSE  ========== */
//     return new GraphQLError(message, {
//       extensions: {
//         code: String(status),
//         status,
//         path: field,
//         timestamp: new Date().toISOString(),
//       },
//     });
//   }
// }

import { Catch, HttpException, Inject, ArgumentsHost } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

interface HttpExceptionResponse {
  message?: string | string[];
  error?: string;
}

@Catch(HttpException)
export class GqlHttpExceptionFilter implements GqlExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost): GraphQLError {
    const gqlHost = GqlArgumentsHost.create(host);
    const status = exception.getStatus();
    const response = exception.getResponse() as HttpExceptionResponse;

    const message = this.extractMessage(response, exception.message);
    const fieldName = this.getFieldName(gqlHost);
    const args = gqlHost.getArgs<Record<string, unknown>>();

    /* ========== SERVER LOG  ========== */
    this.logger.error(`[GraphQL] ${message}`, {
      status,
      field: fieldName,
      stack: exception.stack,
      originalResponse: response,
      variables: args,
    });

    /* ==========  CLIENT RESPONSE  ========== */
    return new GraphQLError(message, {
      extensions: {
        code: this.getErrorCode(status),
        status,
        path: fieldName,
        timestamp: new Date().toISOString(),
      },
    });
  }

  private extractMessage(
    response: HttpExceptionResponse,
    defaultMessage: string,
  ): string {
    if (typeof response.message === 'string') {
      return response.message;
    }

    if (Array.isArray(response.message)) {
      return response.message.join(', ');
    }

    return response.message || defaultMessage;
  }

  private getFieldName(gqlHost: GqlArgumentsHost): string {
    try {
      // Use generic type parameter to get strongly typed GraphQLResolveInfo
      const info = gqlHost.getInfo<GraphQLResolveInfo>();
      return info.fieldName;
    } catch {
      return 'unknown';
    }
  }

  private getErrorCode(status: number): string {
    const statusCodes: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      500: 'INTERNAL_SERVER_ERROR',
    };

    return statusCodes[status] ?? 'INTERNAL_SERVER_ERROR';
  }
}
