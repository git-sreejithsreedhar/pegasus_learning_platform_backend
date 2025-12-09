import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger as WinstonLogger } from 'winston';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: WinstonLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = null;
    let action = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else {
        const respObj = res as Record<string, any>;
        message = respObj.message ?? message;
        code = respObj.code ?? null;
        action = respObj.action ?? null;
      }
    }

    // Logging
    this.logger.error(
      `[REST] ${request.method} ${request.url} failed: ${message}`,
      {
        status,
        stack: exception instanceof Error ? exception.stack : undefined,
      },
    );

    // Response
    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      code,
      action,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}


// import {
//   ArgumentsHost,
//   Catch,
//   ExceptionFilter,
//   HttpException,
//   HttpStatus,
// } from '@nestjs/common';
// import { Request, Response } from 'express';
// import { Logger as WinstonLogger } from 'winston';
// import { EmailNotVerifiedError } from 'src/modules/auth/domain/errors/email-notverified.error';
// import { ResponseConstants } from 'src/core/common/constants/response.constants';

// @Catch()
// export class HttpExceptionFilter implements ExceptionFilter {
//   constructor(private readonly logger: WinstonLogger) {}

//   catch(exception: unknown, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();

//     let status = HttpStatus.INTERNAL_SERVER_ERROR;
//     let message: string | object | string[] = 'Internal server error';

//     // 🌟 1. Domain Errors → Map to Http response
//     if (exception instanceof EmailNotVerifiedError) {
//      status = Number(ResponseConstants.MAIL_NOT_VERIFIED.statusCode);

//       message = ResponseConstants.MAIL_NOT_VERIFIED.message;
//     }

//     // 🌟 2. Already HttpException → Pass as is
//     else if (exception instanceof HttpException) {
//       status = exception.getStatus();
//       const res = exception.getResponse();

//       if (typeof res === 'string') {
//         message = res;
//       } else if (Array.isArray((res as any).message)) {
//         message = (res as any).message.join(', ');
//       } else {
//         message = (res as any).message || exception.message;
//       }
//     }

//     // 🌟 3. Logging
//     this.logger.error(
//       `[REST] ${request.method} ${request.url} failed: ${message}`,
//       {
//         status,
//         stack: exception instanceof Error ? exception.stack : undefined,
//       },
//     );

//     // 🌟 4. Final JSON Response
//     response.status(status).json({
//       success: false,
//       statusCode: status,
//       message,
//       path: request.url,
//       timestamp: new Date().toISOString(),
//     });
//   }
// }

// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
//   HttpStatus,
//   Inject,
// } from '@nestjs/common';
// import { Request, Response } from 'express';
// import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
// import { Logger } from 'winston';

// @Catch()
// export class HttpExceptionFilter implements ExceptionFilter {
//   constructor(
//     @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
//   ) {}

//   catch(exception: unknown, host: ArgumentsHost): void {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();

//     let status = HttpStatus.INTERNAL_SERVER_ERROR;
//     let message = 'Internal server error';

//     if (exception instanceof HttpException) {
//       status = exception.getStatus();
//       const res = exception.getResponse() as { message?: string | string[] };
//       message = Array.isArray(res?.message)
//         ? res.message.join(', ')
//         : res?.message || exception.message;
//     }

//     //  Log details
//     this.logger.error(`[HTTP] ${request.method} ${request.url} - ${message}`, {
//       status,
//       stack: exception instanceof Error ? exception.stack : undefined,
//     });

//     //  Standardized HTTP response
//     response.status(status).json({
//       statusCode: status,
//       message,
//       path: request.url,
//       timestamp: new Date().toISOString(),
//     });
//   }
// }
