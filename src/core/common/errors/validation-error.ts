import { DomainError } from './domain-error';
import { ErrorCode } from './error-code.enum';

export class ValidationError extends DomainError {
  readonly code = ErrorCode.VALIDATION_ERROR;

  constructor(field: string, message: string) {
    super(`Validation failed for ${field}: ${message}`);
  }
}
