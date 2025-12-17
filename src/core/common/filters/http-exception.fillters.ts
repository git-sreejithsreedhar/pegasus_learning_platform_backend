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

// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
//   HttpStatus,
//   Inject,
// } from '@nestjs/common';
// import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
// import { Logger } from 'winston';

// @Catch()
// export class HttpExceptionFilter implements ExceptionFilter {
//   constructor(
//     @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
//   ) {}

//   catch(exception: unknown, host: ArgumentsHost): void {
//     const ctx = host.switchToHttp();
//     const req = ctx.getRequest();
//     const res = ctx.getResponse();

//     let status = HttpStatus.INTERNAL_SERVER_ERROR;
//     let message = 'Internal server error';

//     if (exception instanceof HttpException) {
//       status = exception.getStatus();
//       const response = exception.getResponse() as any;
//       message = Array.isArray(response?.message)
//         ? response.message.join(', ')
//         : response?.message || exception.message;
//     }

//     this.logger.error(`[HTTP] ${req.method} ${req.url}`, {
//       status,
//       message,
//       stack: exception instanceof Error ? exception.stack : undefined,
//     });

//     res.status(status).json({
//       statusCode: status,
//       message,
//       path: req.url,
//       timestamp: new Date().toISOString(),
//     });
//   }
// }
