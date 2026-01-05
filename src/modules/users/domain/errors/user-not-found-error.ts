import { DomainError } from 'src/core/common/errors/domain-error';
import { ErrorCode } from 'src/core/common/errors/error-code.enum';

export class UserNotFoundError extends DomainError {
  readonly code = ErrorCode.USER_NOT_FOUND;

  constructor(userId?: string) {
    super(userId ? `User ${userId} not found` : 'User not found');
  }
}
