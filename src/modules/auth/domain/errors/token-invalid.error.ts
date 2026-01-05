import { DomainError } from 'src/core/common/errors/domain-error';
import { ErrorCode } from 'src/core/common/errors/error-code.enum';

export abstract class TokenInvalidError extends DomainError {
  code = ErrorCode.TOKEN_INVALID;

  constructor() {
    super('Invalid token');
  }
}
