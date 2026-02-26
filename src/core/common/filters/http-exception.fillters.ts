import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { DomainError } from '../errors/domain-error';
import { AppError } from '../errors/app.error';
import { mapErrorCodeToHttpStatus } from '../errors/error-code.mapper';

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
    let errorCode: string | undefined;

    //  Handle AppError
    if (exception instanceof AppError) {
      status = mapErrorCodeToHttpStatus(exception.code);
      message = exception.message;
      errorCode = exception.code;
    }

    //  Handle DomainError
    else if (exception instanceof DomainError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
      errorCode = exception.code;
    }

    // Unknown Error
    else if (exception instanceof Error) {
      message = exception.message;
    }

    this.logger.error(`[HTTP] ${request.method} ${request.url}`, {
      status,
      errorCode,
      exception, // 🔥 only this
    });

    response.status(status).json({
      statusCode: status,
      code: errorCode,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
