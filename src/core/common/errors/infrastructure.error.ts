import { DomainError } from './domain-error';
import { ErrorCode } from './error-code.enum';

export class InfrastructureError extends DomainError {
  readonly code: ErrorCode;

  constructor(
    code: ErrorCode = ErrorCode.SERVICE_UNAVAILABLE,
    message = 'Infrastructure service unavailable',
    readonly metadata?: Record<string, unknown>,
  ) {
    super(message);
    this.code = code;
  }
}
