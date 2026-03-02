import { DomainError } from './domain-error';
import { ErrorCode } from './error-code.enum';

export class UnauthorizedError extends DomainError {
  readonly code = ErrorCode.UNAUTHORIZED;

  constructor(message = 'Unauthorized access') {
    super(message);
  }
}
