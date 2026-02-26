import { DomainError } from './domain-error';
import { ErrorCode } from './error-code.enum';

export class AppError extends DomainError {
  constructor(
    readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
  }
}
