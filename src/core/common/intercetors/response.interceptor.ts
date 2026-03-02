import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

// type for what controllers return
interface ControllerResponse<T> {
  message?: string;
  data?: T;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<ControllerResponse<T>, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<ControllerResponse<T>>,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data: ControllerResponse<T>) => ({
        success: true,
        statusCode: response.statusCode,
        message: data?.message ?? 'Success',
        data: (data?.data ?? data) as T,
      })),
    );
  }
}
