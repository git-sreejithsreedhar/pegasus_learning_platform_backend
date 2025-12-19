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
      // catchError((error) => {
      //   const duration = Date.now() - start;
      //   this.logger.error(
      //     `${actionName} failed in ${duration}ms: ${error?.message}`,
      //   );

      //   throw error; // <<< FIX
      // }),
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
// import { Observable, throwError } from 'rxjs';
// import { catchError, tap } from 'rxjs/operators';
// import { GqlExecutionContext, GqlContextType } from '@nestjs/graphql';
// import { Request } from 'express';
// import { GraphQLResolveInfo } from 'graphql';
// import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
// import { Logger } from 'winston';
// import { randomUUID } from 'crypto';

// interface LogCtx {
//   reqId: string;
//   type: 'REST' | 'GraphQL';
//   method?: string;
//   url?: string;
//   resolver?: string;
//   field?: string;
//   userId?: string;
//   ip?: string;
//   args?: unknown; // added for GraphQL args
// }

// @Injectable()
// export class GlobalLoggingInterceptor implements NestInterceptor {
//   constructor(
//     @Inject(WINSTON_MODULE_PROVIDER)
//     private readonly logger: Logger,
//   ) {}

//   intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
//     const start = Date.now();
//     const reqId = randomUUID(); // unique correlation id

//     const ctx = this.buildLogContext(context, reqId);

//     this.logger.info('Incoming request', ctx);

//     return next.handle().pipe(
//       tap((data) => {
//         this.logger.info('Request completed', {
//           ...ctx,
//           duration: Date.now() - start,
//           status: 'success',
//         });
//       }),
//       catchError((err: unknown) => {
//         this.logger.error('Request failed', {
//           ...ctx,
//           duration: Date.now() - start,
//           status: 'error',
//           error: err instanceof Error ? err.message : err,
//           stack: err instanceof Error ? err.stack : undefined,
//           response: (err as any)?.getResponse?.(),
//         });
//         return throwError(() => err);
//       }),
//     );
//   }

//   private buildLogContext(context: ExecutionContext, reqId: string): LogCtx {
//     const type = context.getType<GqlContextType>();

//     const base: LogCtx = {
//       reqId,
//       type: type === 'http' ? 'REST' : 'GraphQL',
//     };

//     // REST
//     if (type === 'http') {
//       const req = context.switchToHttp().getRequest<Request>();
//       return {
//         ...base,
//         method: req.method,
//         url: req.originalUrl || req.url,
//         ip: req.ip,
//         userId: (req as any).user?.id,
//       };
//     }

//     // GRAPHQL
//     if (type === 'graphql') {
//       const gql = GqlExecutionContext.create(context);
//       const info = gql.getInfo<GraphQLResolveInfo>();
//       const args = gql.getArgs();
//       const req = gql.getContext<{ req?: Request }>().req;

//       return {
//         ...base,
//         resolver: info.parentType.name,
//         field: info.fieldName,
//         ip: req?.ip,
//         userId: (req as any)?.user?.id,
//         args: process.env.NODE_ENV === 'development' ? args : undefined,
//       };
//     }

//     return base;
//   }
// }
