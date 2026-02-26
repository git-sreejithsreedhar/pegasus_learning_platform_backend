import { Catch, Inject, ArgumentsHost } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AppError } from '../errors/app.error';
import { DomainError } from '../errors/domain-error';
import { ErrorCode } from '../errors/error-code.enum';
import { mapErrorCodeToHttpStatus } from '../errors/error-code.mapper';

@Catch()
export class AppGqlExceptionFilter implements GqlExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): GraphQLError {
    if (host.getType<'graphql'>() !== 'graphql') {
      throw exception;
    }

    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo<GraphQLResolveInfo>();
    // const args = gqlHost.getArgs<Record<string, unknown>>();

    const parentType = info?.parentType?.name ?? 'UnknownType';
    const fieldName = info?.fieldName ?? 'unknown';

    let message = 'Internal server error';
    let code = ErrorCode.INTERNAL_SERVER_ERROR;
    let status = 500;

    if (exception instanceof AppError) {
      code = exception.code;
      message = exception.message;
      status = mapErrorCodeToHttpStatus(code);
    } else if (exception instanceof DomainError) {
      message = exception.message;
      code = exception.code as ErrorCode;
      status = 400;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    this.logger.error(`[GraphQL] ${parentType}.${fieldName}`, {
      code,
      status,
      exception,
    });

    return new GraphQLError(message, {
      extensions: {
        code,
        status,
        field: fieldName,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
