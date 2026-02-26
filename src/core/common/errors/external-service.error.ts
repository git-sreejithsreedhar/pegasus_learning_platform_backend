import { DomainError } from './domain-error';
import { ErrorCode } from './error-code.enum';

export class ExternalServiceError extends DomainError {
  readonly code = ErrorCode.EXTERNAL_SERVICE_ERROR;

  constructor(service: string) {
    super(`${service} is unavailable`);
  }
}
