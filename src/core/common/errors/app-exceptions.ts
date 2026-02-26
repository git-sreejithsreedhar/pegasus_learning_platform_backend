import { ErrorCode } from './error-code.enum';

/**
 * Base application exception class
 * All domain and application errors should extend this class
 */
export abstract class AppException extends Error {
  abstract readonly code: ErrorCode;
  abstract readonly statusCode: number;

  constructor(
    message: string,
    readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON() {
    return {
      code: this.code,
      statusCode: this.statusCode,
      message: this.message,
      ...(this.details && { details: this.details }),
    };
  }
}

/**
 * Authentication & Authorization Exceptions
 */

export class InvalidCredentialsException extends AppException {
  readonly code = ErrorCode.INVALID_CREDENTIALS;
  readonly statusCode = 401;

  constructor(message = 'Invalid email or password') {
    super(message);
  }
}

export class UnauthorizedException extends AppException {
  readonly code = ErrorCode.UNAUTHORIZED;
  readonly statusCode = 401;

  constructor(message = 'Unauthorized access') {
    super(message);
  }
}

export class ForbiddenException extends AppException {
  readonly code = ErrorCode.FORBIDDEN;
  readonly statusCode = 403;

  constructor(message = 'Forbidden') {
    super(message);
  }
}

export class TokenExpiredException extends AppException {
  readonly code = ErrorCode.TOKEN_EXPIRED;
  readonly statusCode = 401;

  constructor(message = 'Token has expired') {
    super(message);
  }
}

export class TokenInvalidException extends AppException {
  readonly code = ErrorCode.TOKEN_INVALID;
  readonly statusCode = 401;

  constructor(message = 'Token is invalid') {
    super(message);
  }
}

export class TokenRevokedException extends AppException {
  readonly code = ErrorCode.TOKEN_REVOKED;
  readonly statusCode = 401;

  constructor(message = 'Token has been revoked') {
    super(message);
  }
}

export class EmailNotVerifiedException extends AppException {
  readonly code = ErrorCode.EMAIL_NOT_VERIFIED;
  readonly statusCode = 403;

  constructor(message = 'Email has not been verified') {
    super(message);
  }
}

export class InsufficientPermissionsException extends AppException {
  readonly code = ErrorCode.INSUFFICIENT_PERMISSIONS;
  readonly statusCode = 403;

  constructor(message = 'Insufficient permissions for this action') {
    super(message);
  }
}

/**
 * User-Related Exceptions
 */

export class UserNotFoundException extends AppException {
  readonly code = ErrorCode.USER_NOT_FOUND;
  readonly statusCode = 404;

  constructor(message = 'User not found') {
    super(message);
  }
}

export class UserAlreadyExistsException extends AppException {
  readonly code = ErrorCode.USER_ALREADY_EXISTS;
  readonly statusCode = 409;

  constructor(message = 'User already exists') {
    super(message);
  }
}

export class UserBlockedException extends AppException {
  readonly code = ErrorCode.USER_BLOCKED;
  readonly statusCode = 403;

  constructor(message = 'User account has been blocked') {
    super(message);
  }
}

/**
 * Validation Exceptions
 */

export class ValidationException extends AppException {
  readonly code = ErrorCode.VALIDATION_ERROR;
  readonly statusCode = 400;

  constructor(
    message = 'Validation failed',
    details?: Record<string, unknown>,
  ) {
    super(message, details);
  }
}

export class InvalidEmailException extends AppException {
  readonly code = ErrorCode.INVALID_EMAIL;
  readonly statusCode = 400;

  constructor(message = 'Invalid email format') {
    super(message);
  }
}

export class InvalidPasswordException extends AppException {
  readonly code = ErrorCode.INVALID_PASSWORD;
  readonly statusCode = 400;

  constructor(
    message = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
  ) {
    super(message);
  }
}

export class InvalidIdFormatException extends AppException {
  readonly code = ErrorCode.INVALID_ID_FORMAT;
  readonly statusCode = 400;

  constructor(message = 'Invalid ID format') {
    super(message);
  }
}

/**
 * Resource-Related Exceptions
 */

export class ResourceNotFoundException extends AppException {
  readonly code = ErrorCode.RESOURCE_NOT_FOUND;
  readonly statusCode = 404;

  constructor(resource = 'Resource', message?: string) {
    super(message || `${resource} not found`);
  }
}

export class ResourceAlreadyExistsException extends AppException {
  readonly code = ErrorCode.RESOURCE_ALREADY_EXISTS;
  readonly statusCode = 409;

  constructor(resource = 'Resource', message?: string) {
    super(message || `${resource} already exists`);
  }
}

export class ResourceConflictException extends AppException {
  readonly code = ErrorCode.RESOURCE_CONFLICT;
  readonly statusCode = 409;

  constructor(message = 'Resource conflict') {
    super(message);
  }
}

/**
 * Mentor-Specific Exceptions
 */

export class MentorNotFoundException extends AppException {
  readonly code = ErrorCode.MENTOR_NOT_FOUND;
  readonly statusCode = 404;

  constructor(message = 'Mentor not found') {
    super(message);
  }
}

export class MentorNotApprovedException extends AppException {
  readonly code = ErrorCode.MENTOR_NOT_APPROVED;
  readonly statusCode = 403;

  constructor(message = 'Mentor profile has not been approved') {
    super(message);
  }
}

/**
 * Admin-Specific Exceptions
 */

export class AdminNotFoundException extends AppException {
  readonly code = ErrorCode.ADMIN_NOT_FOUND;
  readonly statusCode = 404;

  constructor(message = 'Admin not found') {
    super(message);
  }
}

export class ActionNotAllowedException extends AppException {
  readonly code = ErrorCode.ACTION_NOT_ALLOWED;
  readonly statusCode = 403;

  constructor(message = 'This action is not allowed') {
    super(message);
  }
}

/**
 * Operation-Related Exceptions
 */

export class OperationFailedException extends AppException {
  readonly code = ErrorCode.OPERATION_FAILED;
  readonly statusCode = 500;

  constructor(message = 'Operation failed', details?: Record<string, unknown>) {
    super(message, details);
  }
}

export class InvalidOperationException extends AppException {
  readonly code = ErrorCode.INVALID_OPERATION;
  readonly statusCode = 400;

  constructor(message = 'Invalid operation') {
    super(message);
  }
}

/**
 * External Service Exceptions
 */

export class EmailServiceFailedException extends AppException {
  readonly code = ErrorCode.EMAIL_SERVICE_FAILED;
  readonly statusCode = 500;

  constructor(message = 'Failed to send email') {
    super(message);
  }
}

export class FileUploadFailedException extends AppException {
  readonly code = ErrorCode.FILE_UPLOAD_FAILED;
  readonly statusCode = 500;

  constructor(message = 'File upload failed') {
    super(message);
  }
}

export class ExternalServiceException extends AppException {
  readonly code = ErrorCode.EXTERNAL_SERVICE_ERROR;
  readonly statusCode = 502;

  constructor(serviceName = 'External service', message?: string) {
    super(message || `${serviceName} error`);
  }
}

/**
 * Rate Limiting Exceptions
 */

export class RateLimitExceededException extends AppException {
  readonly code = ErrorCode.RATE_LIMIT_EXCEEDED;
  readonly statusCode = 429;

  constructor(message = 'Too many requests. Please try again later.') {
    super(message);
  }
}

/**
 * Server Exceptions
 */

export class DatabaseException extends AppException {
  readonly code = ErrorCode.DATABASE_ERROR;
  readonly statusCode = 500;

  constructor(
    message = 'Database operation failed',
    details?: Record<string, unknown>,
  ) {
    super(message, details);
  }
}

export class ServiceUnavailableException extends AppException {
  readonly code = ErrorCode.SERVICE_UNAVAILABLE;
  readonly statusCode = 503;

  constructor(message = 'Service temporarily unavailable') {
    super(message);
  }
}

/**
 * Configuration Exceptions
 */

export class ConfigMissingException extends AppException {
  readonly code = ErrorCode.CONFIG_MISSING;
  readonly statusCode = 500;

  constructor(configKey: string) {
    super(`Configuration missing: ${configKey}`);
  }
}

export class ConfigInvalidException extends AppException {
  readonly code = ErrorCode.CONFIG_INVALID;
  readonly statusCode = 500;

  constructor(configKey: string, message?: string) {
    super(message || `Invalid configuration: ${configKey}`);
  }
}
