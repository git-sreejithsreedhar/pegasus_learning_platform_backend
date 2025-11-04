// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
//   Inject,
// } from '@nestjs/common';
// import { GqlArgumentsHost } from '@nestjs/graphql';
// import { Response, Request } from 'express';
// import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
// import { Logger } from 'winston';
// import { ResponseConstants } from '../constants/response.constants';
// import { HttpStatusCode } from '../enums/http-status.enum';

// @Catch()
// export class HttpExceptionFilter implements ExceptionFilter {
//   constructor(
//     @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
//   ) {}

//   catch(exception: unknown, host: ArgumentsHost): void {
//     const gqlHost = GqlArgumentsHost.create(host);
//     // const contextType = host.getType();
//     const contextType = host.getType<'http' | 'rpc' | 'ws' | 'graphql'>();
//     const isGraphQL = contextType === 'graphql';

//     // const isGraphQL = contextType  === 'graphql';

//     const request = isGraphQL
//       ? gqlHost.getContext<{ req: Request }>().req
//       : host.switchToHttp().getRequest<Request>();

//     const response = isGraphQL
//       ? null
//       : host.switchToHttp().getResponse<Response>();

//     let status: number;
//     let message: string;

//     if (exception instanceof HttpException) {
//       status = exception.getStatus();
//       const res = exception.getResponse() as
//         | { message?: string | string[] }
//         | string;
//       message =
//         typeof res === 'string'
//           ? res
//           : Array.isArray(res.message)
//             ? res.message.join(', ')
//             : res.message || exception.message;
//     } else {
//       status = HttpStatusCode.INTERNAL_SERVER_ERROR;
//       message = ResponseConstants.SERVER_ERROR.message;
//     }

//     // Safe logging
//     this.logger.error(
//       `[${request?.method || 'UNKNOWN'}] ${request?.url || 'UNKNOWN'} - ${message}`,
//       {
//         status,
//         stack: exception instanceof Error ? exception.stack : undefined,
//       },
//     );

//     // HTTP Response
//     if (response) {
//       response.status(status).json({
//         statusCode: status,
//         message,
//         path: request?.url,
//         timestamp: new Date().toISOString(),
//       });
//     }

//     // GraphQL Response
//     if (isGraphQL) {
//       throw new HttpException(message, status);
//     }
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
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as { message?: string | string[] };
      message = Array.isArray(res?.message)
        ? res.message.join(', ')
        : res?.message || exception.message;
    }

    // 🧾 Log details
    this.logger.error(`[HTTP] ${request.method} ${request.url} - ${message}`, {
      status,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    // 🧠 Standardized HTTP response
    response.status(status).json({
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
