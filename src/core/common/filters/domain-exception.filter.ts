import { ExceptionFilter, Catch, ArgumentsHost, Inject } from '@nestjs/common';
import { Response, Request } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { DomainError } from 'src/core/common/errors/domain-error';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  catch(exception: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logger.error(exception.message, {
      stack: exception.stack,
    });

    response.status(400).json({
      statusCode: 400,
      message: exception.message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
