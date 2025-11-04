import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';
import { GraphQLResolveInfo } from 'graphql';

@Injectable()
export class GlobalLoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: WinstonLogger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    let actionName = '';
    let details = '';

    const type = context.getType();

    // ✅ Handle REST requests
    if (type === 'http') {
      const req = context
        .switchToHttp()
        .getRequest<Request & { body?: unknown }>();
      const { method, url, body } = req;
      actionName = `[REST] ${method} ${url}`;
      details = JSON.stringify(body ?? {});
    }

    // ✅ Handle GraphQL requests
    else if ((context.getType() as unknown) === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      const info = gqlCtx.getInfo<GraphQLResolveInfo>();
      const args = gqlCtx.getArgs<Record<string, unknown>>();

      const resolver = info?.parentType?.name ?? 'UnknownResolver';
      const field = info?.fieldName ?? 'UnknownField';

      actionName = `[GraphQL] ${resolver}.${field}`;
      details = JSON.stringify(args);
    }

    const start = Date.now();
    this.logger.info(`${actionName} called`);
    this.logger.debug(`Args: ${details}`);

    return next.handle().pipe(
      tap((result) => {
        const duration = Date.now() - start;
        this.logger.info(`${actionName} completed in ${duration}ms`);
        this.logger.debug(`Result: ${JSON.stringify(result)}`);
      }),
      catchError((error: unknown) => {
        const duration = Date.now() - start;
        let message = 'Unknown error';

        if (error instanceof Error) {
          message = error.message;
        }

        this.logger.error(`${actionName} failed in ${duration}ms: ${message}`);

        return throwError(() => error);
      }),
    );
  }
}

// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
//   Inject,
// } from '@nestjs/common';
// import { Observable, tap } from 'rxjs';
// import { GqlExecutionContext } from '@nestjs/graphql';
// import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
// import { Logger as WinstonLogger } from 'winston';
// import { GraphQLResolveInfo } from 'graphql';

// @Injectable()
// export class GlobalLoggingInterceptor implements NestInterceptor {
//   constructor(
//     @Inject(WINSTON_MODULE_PROVIDER)
//     private readonly logger: WinstonLogger,
//   ) {}

//   intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
//     let actionName = '';
//     let details = '';

//     // Handle REST API context
//     if (context.getType() === 'http') {
//       const req = context
//         .switchToHttp()
//         .getRequest<Request & { body?: unknown }>();
//       const { method, url, body } = req;
//       actionName = `[REST] ${method} ${url}`;
//       details = JSON.stringify(body ?? {});
//     }

//     // Handle GraphQL context
//     else if ((context.getType() as unknown) === 'graphql') {
//       const gqlCtx = GqlExecutionContext.create(context);
//       const info = gqlCtx.getInfo<GraphQLResolveInfo>();
//       const args = gqlCtx.getArgs<Record<string, unknown>>();
//       const resolverName = info?.parentType?.name ?? 'UnknownResolver';
//       const fieldName = info?.fieldName ?? 'UnknownField';
//       actionName = `[GraphQL] ${resolverName}.${fieldName}`;
//       details = JSON.stringify(args);
//     }

//     const start = Date.now();
//     this.logger.info(`${actionName} called`);
//     this.logger.debug(`Args: ${details}`);

//     return next.handle().pipe(
//       tap((result) => {
//         const duration = Date.now() - start;
//         this.logger.info(
//           `${actionName} completed in ${duration}ms | Result: ${JSON.stringify(result)}`,
//         );
//       }),
//     );
//   }
// }
