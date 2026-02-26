import {
  Injectable,
  NestInterceptor,
  Inject,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Observable, tap, catchError, throwError } from 'rxjs';
import * as winston from 'winston';

@Injectable()
export class GlobalLoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: winston.Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    let actionName = '';
    let metadata: Record<string, unknown> = {};

    const type = context.getType();

    if (type === 'http') {
      const req = context.switchToHttp().getRequest<Request>();
      actionName = `[REST] ${req.method} ${req.url}`;
      metadata = {
        method: req.method,
        url: req.url,
        body: req.body,
      };
    } else if ((type as unknown) === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      const info = gqlCtx.getInfo<GraphQLResolveInfo>();

      actionName = `[GraphQL] ${info.parentType.name}.${info.fieldName}`;
      metadata = {
        resolver: info.parentType.name,
        field: info.fieldName,
        args: gqlCtx.getArgs(),
      };
    }

    const start = Date.now();
    this.logger.info(`${actionName} called`, metadata);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        this.logger.info(`${actionName} completed`, {
          duration: `${duration}ms`,
        });
      }),

      // NO error logging here
      catchError((error: unknown) => {
        return throwError(() => error);
      }),
    );
  }
}
