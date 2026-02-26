import { DomainError } from './domain-error';
import { ErrorCode } from './error-code.enum';

export class ResourceConflictError extends DomainError {
  readonly code = ErrorCode.RESOURCE_CONFLICT;

  constructor(message: string) {
    super(message);
  }
}
