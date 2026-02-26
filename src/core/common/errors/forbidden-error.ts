import { DomainError } from './domain-error';
import { ErrorCode } from './error-code.enum';

export class ForbiddenError extends DomainError {
  readonly code = ErrorCode.FORBIDDEN;

  constructor() {
    super('Action is forbidden');
  }
}
