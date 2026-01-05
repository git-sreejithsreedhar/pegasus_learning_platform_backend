import { DomainError } from 'src/core/common/errors/domain-error';
import { ErrorCode } from 'src/core/common/errors/error-code.enum';

export class InvalidCredentialsError extends DomainError {
  readonly code = ErrorCode.INVALID_CREDENTIALS;

  constructor() {
    super('Invalid credentials');
  }
}
