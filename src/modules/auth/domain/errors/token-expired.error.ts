import { DomainError } from 'src/core/common/errors/domain-error';
import { ErrorCode } from 'src/core/common/errors/error-code.enum';

export class TokenExpiredError extends DomainError {
  readonly code = ErrorCode.TOKEN_EXPIRED;

  constructor() {
    super('Token has expired');
  }
}
