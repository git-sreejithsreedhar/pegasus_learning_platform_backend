# Error Handling Guide

## Overview

The application uses a standardized error handling system with custom exception classes, centralized error codes, and dedicated exception filters for both REST and GraphQL endpoints.

## Architecture

### 1. Error Codes (`error-code.enum.ts`)

All errors are categorized with specific error codes mapped to HTTP status codes:

```typescript
export enum ErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS', // 401
  TOKEN_EXPIRED = 'TOKEN_EXPIRED', // 401
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED', // 403
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS', // 403
  USER_NOT_FOUND = 'USER_NOT_FOUND', // 404
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS', // 409
  VALIDATION_ERROR = 'VALIDATION_ERROR', // 400
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR', // 500
  // ... more codes
}
```

### 2. Custom Exception Classes (`app-exceptions.ts`)

All exceptions extend `AppException` base class:

```typescript
abstract class AppException extends Error {
  abstract readonly code: ErrorCode;
  abstract readonly statusCode: number;

  constructor(message: string, details?: Record<string, unknown>) {
    // ...
  }
}
```

#### Authentication Exceptions

- `InvalidCredentialsException` - Wrong email/password (401)
- `TokenExpiredException` - JWT expired (401)
- `TokenInvalidException` - Malformed/tampered JWT (401)
- `UnauthorizedException` - Missing auth (401)
- `EmailNotVerifiedException` - Unverified email (403)

#### User Exceptions

- `UserNotFoundException` - User doesn't exist (404)
- `UserAlreadyExistsException` - Duplicate user (409)
- `UserBlockedException` - Account disabled (403)

#### Validation Exceptions

- `ValidationException` - Generic validation failure (400)
- `InvalidEmailException` - Bad email format (400)
- `InvalidPasswordException` - Weak password (400)
- `InvalidIdFormatException` - Invalid MongoDB ID (400)

#### Resource Exceptions

- `ResourceNotFoundException` - Resource doesn't exist (404)
- `ResourceAlreadyExistsException` - Duplicate resource (409)
- `ResourceConflictException` - Conflicting state (409)

#### Service Exceptions

- `EmailServiceFailedException` - Email send failed (500)
- `FileUploadFailedException` - Upload failed (500)
- `DatabaseException` - DB operation failed (500)
- `ExternalServiceException` - Third-party error (502)

### 3. Exception Filters

#### REST API Filter (`HttpExceptionFilter`)

Handles all HTTP exceptions and converts them to standardized JSON responses.

**Response Format:**

```json
{
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "Password must be at least 8 characters",
  "path": "/api/v1/auth/update-password",
  "timestamp": "2026-02-24T10:30:00.000Z",
  "details": {
    "newPassword": [
      "Password must include uppercase, lowercase, number, and special character"
    ]
  }
}
```

#### GraphQL Filter (`GqlHttpExceptionFilter`)

Handles GraphQL errors and returns them in GraphQL error format.

**Response Format:**

```json
{
  "errors": [
    {
      "message": "Email not verified",
      "extensions": {
        "code": "EMAIL_NOT_VERIFIED",
        "status": 403,
        "path": "verifyEmail",
        "timestamp": "2026-02-24T10:30:00.000Z"
      }
    }
  ]
}
```

## Usage Examples

### 1. Throwing Custom Exceptions

```typescript
import { Controller, Post, Body, Inject } from '@nestjs/common';
import {
  InvalidCredentialsException,
  UserNotFoundException,
  EmailServiceFailedException,
  ValidationException,
} from 'src/core/common/errors/app-exceptions';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() credentials: LoginInput) {
    const user = await this.userService.findByEmail(credentials.email);

    if (!user) {
      throw new UserNotFoundException('No account found with this email');
    }

    const passwordValid = await this.passwordHasher.compare(
      credentials.password,
      user.password,
    );

    if (!passwordValid) {
      throw new InvalidCredentialsException('Invalid password');
    }

    return { user, accessToken };
  }

  @Post('send-verification-email')
  async sendVerificationEmail(@Body() dto: SendVerificationDto) {
    try {
      await this.mailService.sendVerificationEmail(dto.email);
    } catch (error) {
      throw new EmailServiceFailedException(
        'Failed to send verification email',
      );
    }
  }
}
```

### 2. Using Error Utilities

```typescript
import {
  validateMongoId,
  handleDatabaseError,
  validateRequiredFields,
  logStructuredError,
} from 'src/core/common/errors/error-handling.utils';

@Service()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: Logger,
  ) {}

  async getUserById(userId: string) {
    // Validate MongoDB ID format
    validateMongoId(userId, 'User ID');

    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new UserNotFoundException(`User ${userId} not found`);
      }

      return user;
    } catch (error) {
      logStructuredError(this.logger, error, {
        operation: 'getUserById',
        userId,
      });

      if (error instanceof AppException) {
        throw error;
      }

      throw handleDatabaseError(error, 'User fetch');
    }
  }

  async updateUser(userId: string, updateData: UpdateUserDto) {
    // Validate required fields
    validateRequiredFields(updateData, ['name', 'email']);

    try {
      const updated = await this.userRepository.update(userId, updateData);
      return updated;
    } catch (error) {
      throw handleDatabaseError(error, 'User update');
    }
  }
}
```

### 3. Error Handling in Services

```typescript
import {
  DatabaseException,
  OperationFailedException,
} from 'src/core/common/errors/app-exceptions';

@Service()
export class AuthService {
  constructor(
    private readonly jwtService: JwtTokenService,
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) {}

  async verifyToken(token: string) {
    try {
      return await this.jwtService.verifyAccessToken(token);
    } catch (error) {
      if (error instanceof TokenExpiredException) {
        throw error; // Re-throw known errors
      }

      if (error instanceof TokenInvalidException) {
        throw error;
      }

      this.logger.error('Token verification failed', error);
      throw new UnauthorizedException('Token verification failed');
    }
  }
}
```

### 4. Graceful Error Handling

```typescript
@Service()
export class EmailService {
  async sendVerificationEmail(to: string, link: string) {
    try {
      await this.transporter.sendMail({
        from: this.config.get('mail.from'),
        to,
        subject: 'Verify your email',
        html: this.getVerificationTemplate(link),
      });
    } catch (error) {
      this.logger.error('Email send failed', {
        recipient: to,
        error: error instanceof Error ? error.message : String(error),
      });

      // Throw specific exception
      throw new EmailServiceFailedException(
        'Failed to send verification email. Please try again later.',
      );
    }
  }
}
```

## Error Response Format

### Success Response (200)

```json
{
  "user": { ... },
  "accessToken": "eyJ0eXAi..."
}
```

### Error Response Format

All error responses follow this structure:

```json
{
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "path": "/api/v1/endpoint",
  "timestamp": "2026-02-24T10:30:00.000Z",
  "details": { ... }  // Optional, for additional error details
}
```

**Status Code Mapping:**

- `2xx` - Success
- `400` - Validation/Bad Request errors
- `401` - Authentication errors (invalid credentials, token expired)
- `403` - Authorization errors (forbidden, not verified)
- `404` - Not found errors
- `409` - Conflict errors (duplicate, resource exists)
- `429` - Rate limit exceeded
- `500` - Server/Database errors
- `502` - External service errors
- `503` - Service unavailable

## Logging

All errors are automatically logged with context:

```typescript
// HTTP errors (500+) logged as ERROR
logger.error('[HTTP 500] POST /api/v1/auth/login', {
  statusCode: 500,
  code: 'DATABASE_ERROR',
  message: 'User fetch failed',
  stack: '...',
  ip: '192.168.1.1',
});

// HTTP errors (400-499) logged as WARN
logger.warn('[HTTP 400] POST /api/v1/auth/login', {
  statusCode: 400,
  code: 'VALIDATION_ERROR',
  message: 'Email is required',
  ip: '192.168.1.1',
});
```

## Best Practices

### 1. Always Validate Input

```typescript
// ✅ GOOD - Validate before using
if (!userId) {
  throw new ValidationException('User ID is required');
}

// ❌ BAD - No validation
const user = await userService.findById(userId);
```

### 2. Use Specific Exceptions

```typescript
// ✅ GOOD - Specific exception
if (!user.isEmailVerified) {
  throw new EmailNotVerifiedException();
}

// ❌ BAD - Generic exception
if (!user.isEmailVerified) {
  throw new HttpException('Not verified', 403);
}
```

### 3. Log with Context

```typescript
// ✅ GOOD - Structured logging
logStructuredError(logger, error, {
  operation: 'sendEmail',
  userId: user.id,
  email: recipient,
});

// ❌ BAD - No context
console.error(error);
```

### 4. Don't Expose Internal Errors

```typescript
// ✅ GOOD - Safe message
throw new EmailServiceFailedException(
  'Failed to send email. Please try again.',
);

// ❌ BAD - Exposes internals
throw new Error(`SMTP Error: ${err.message}`);
```

### 5. Catch and Convert Unknown Errors

```typescript
// ✅ GOOD - Convert to known exception
try {
  await externalApi.call();
} catch (error) {
  throw new ExternalServiceException('External API', error.message);
}

// ❌ BAD - Let it propagate
try {
  await externalApi.call();
} catch (error) {
  throw error;
}
```

## Testing Error Handling

```typescript
describe('Auth Controller', () => {
  describe('login', () => {
    it('should throw InvalidCredentialsException on wrong password', async () => {
      // Arrange
      const credentials = { email: 'test@test.com', password: 'wrong' };
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);
      jest.spyOn(passwordHasher, 'compare').mockResolvedValue(false);

      // Act & Assert
      await expect(controller.login(credentials)).rejects.toThrow(
        InvalidCredentialsException,
      );
    });

    it('should return correct error code and status', async () => {
      // Arrange
      const exception = new InvalidCredentialsException();

      // Assert
      expect(exception.code).toBe(ErrorCode.INVALID_CREDENTIALS);
      expect(exception.statusCode).toBe(401);
    });
  });
});
```

## Migration Guide

### From Old Error Handling

```typescript
// OLD - Using HttpException
throw new HttpException('Invalid email or password', 401);

// NEW - Using specific exception
throw new InvalidCredentialsException();
```

```typescript
// OLD - console.error
catch (error) {
  console.error(error);
}

// NEW - Structured logging
catch (error) {
  logStructuredError(logger, error, { operation: 'login', userId });
  throw error;
}
```

```typescript
// OLD - Generic error response
return { error: 'Something went wrong' };

// NEW - Let filter handle it
throw new OperationFailedException('Operation failed');
```

## Summary

✅ **Use custom exception classes** for all errors  
✅ **Use appropriate error codes** for each situation  
✅ **Log with context** for debugging  
✅ **Return safe messages** to clients  
✅ **Handle database errors** gracefully  
✅ **Validate input** early  
✅ **Test error scenarios**
