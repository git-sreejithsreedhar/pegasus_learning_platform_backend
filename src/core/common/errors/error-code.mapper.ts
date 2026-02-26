import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-code.enum';

export function mapErrorCodeToHttpStatus(code: ErrorCode): HttpStatus {
  switch (code) {
    case ErrorCode.VALIDATION_ERROR:
    case ErrorCode.INVALID_EMAIL:
    case ErrorCode.INVALID_PASSWORD:
      return HttpStatus.BAD_REQUEST;

    case ErrorCode.USER_NOT_FOUND:
    case ErrorCode.RESOURCE_NOT_FOUND:
      return HttpStatus.NOT_FOUND;

    case ErrorCode.USER_ALREADY_EXISTS:
    case ErrorCode.RESOURCE_CONFLICT:
      return HttpStatus.CONFLICT;

    case ErrorCode.UNAUTHORIZED:
    case ErrorCode.INVALID_CREDENTIALS:
      return HttpStatus.UNAUTHORIZED;

    case ErrorCode.FORBIDDEN:
      return HttpStatus.FORBIDDEN;

    case ErrorCode.TOO_MANY_REQUESTS:
      return HttpStatus.TOO_MANY_REQUESTS;

    case ErrorCode.SERVICE_UNAVAILABLE:
      return HttpStatus.SERVICE_UNAVAILABLE;

    default:
      return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
