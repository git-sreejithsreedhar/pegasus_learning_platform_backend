import { DomainError } from 'src/core/common/errors/domain-error';
import { ErrorCode } from 'src/core/common/errors/error-code.enum';

export class UserBlockedError extends DomainError {
  readonly code = ErrorCode.USER_BLOCKED;

  constructor() {
    super('User is blocked. Contact support');
  }
}
