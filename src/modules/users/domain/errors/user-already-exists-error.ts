import { DomainError } from 'src/core/common/errors/domain-error';
import { ErrorCode } from 'src/core/common/errors/error-code.enum';

export abstract class UserAlreadyExists extends DomainError {
  readonly code = ErrorCode.USER_ALREADY_EXISTS;

  constructor(userId?: string) {
    super(userId ? `User ${userId} not found` : 'User not found');
  }
}
