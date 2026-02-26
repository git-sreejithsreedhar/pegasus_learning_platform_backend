# Error Handling - Quick Reference

## Common Exceptions & When to Use

### Authentication (401)

```typescript
throw new InvalidCredentialsException('Invalid email or password');
throw new UnauthorizedException('No token provided');
throw new TokenExpiredException('Token has expired');
throw new TokenInvalidException('Token is invalid or tampered');
throw new EmailNotVerifiedException('Email not verified');
```

### Authorization (403)

```typescript
throw new ForbiddenException('Access denied');
throw new InsufficientPermissionsException('Admin only');
throw new UserBlockedException('Account blocked');
```

### Not Found (404)

```typescript
throw new UserNotFoundException('User not found');
throw new ResourceNotFoundException('Resource', 'Custom message');
throw new MentorNotFoundException('Mentor not found');
```

### Validation (400)

```typescript
throw new ValidationException('Validation failed', { fields: [...] });
throw new InvalidEmailException('Invalid email format');
throw new InvalidPasswordException('Password too weak');
throw new InvalidIdFormatException('Invalid user ID');
```

### Conflict (409)

```typescript
throw new UserAlreadyExistsException('User already exists');
throw new ResourceAlreadyExistsException('Resource', 'Custom message');
throw new ResourceConflictException('Resource conflict');
```

### Server Errors (500)

```typescript
throw new DatabaseException('Query failed', { originalError });
throw new EmailServiceFailedException('Email send failed');
throw new FileUploadFailedException('Upload failed');
throw new ExternalServiceException('PaymentAPI', 'Payment failed');
throw new OperationFailedException('Operation failed', { details });
```

### Rate Limiting (429)

```typescript
throw new RateLimitExceededException('Too many requests');
```

## Error Utilities

### Validate MongoDB ID

```typescript
import { validateMongoId } from 'src/core/common/errors/error-handling.utils';

validateMongoId(userId, 'User ID'); // Throws InvalidIdFormatException if invalid
```

### Validate Required Fields

```typescript
import { validateRequiredFields } from 'src/core/common/errors/error-handling.utils';

validateRequiredFields(data, ['name', 'email', 'password']);
// Throws ValidationException if any field is missing
```

### Handle Database Errors

```typescript
import { handleDatabaseError } from 'src/core/common/errors/error-handling.utils';

try {
  await db.insert(data);
} catch (error) {
  throw handleDatabaseError(error, 'User creation');
}
```

### Log Structured Errors

```typescript
import { logStructuredError } from 'src/core/common/errors/error-handling.utils';

logStructuredError(logger, error, {
  operation: 'sendEmail',
  userId: user.id,
  email: recipient,
});
```

## Import Pattern

```typescript
// Import all exceptions from one file
import {
  InvalidCredentialsException,
  UserNotFoundException,
  ValidationException,
  DatabaseException,
  // ... more exceptions
} from 'src/core/common/errors/app-exceptions';

// Import utilities
import {
  validateMongoId,
  validateRequiredFields,
  handleDatabaseError,
  logStructuredError,
} from 'src/core/common/errors/error-handling.utils';

// Import enums
import { ErrorCode } from 'src/core/common/errors/error-code.enum';
```

## Controller Example

```typescript
import { Controller, Post, Body, Inject, Logger } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  InvalidCredentialsException,
  UserNotFoundException,
  EmailServiceFailedException,
  ValidationException,
} from 'src/core/common/errors/app-exceptions';
import { logStructuredError } from 'src/core/common/errors/error-handling.utils';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() credentials: LoginInput) {
    try {
      this.logger.log(`Login attempt for ${credentials.email}`);
      return await this.authService.login(credentials);
    } catch (error) {
      logStructuredError(this.logger, error, {
        operation: 'login',
        email: credentials.email,
      });
      throw error;
    }
  }

  @Post('send-email')
  async sendEmail(@Body() dto: SendEmailDto) {
    try {
      await this.emailService.send(dto);
      return { message: 'Email sent' };
    } catch (error) {
      throw new EmailServiceFailedException('Failed to send email');
    }
  }
}
```

## Service Example

```typescript
import { Injectable, Logger, Inject } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  UserNotFoundException,
  DatabaseException,
} from 'src/core/common/errors/app-exceptions';
import {
  validateMongoId,
  handleDatabaseError,
  logStructuredError,
} from 'src/core/common/errors/error-handling.utils';

@Injectable()
export class UserService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly userRepository: UserRepository,
  ) {}

  async getUserById(userId: string) {
    try {
      // Validate input
      validateMongoId(userId, 'User ID');

      // Fetch user
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new UserNotFoundException(`User ${userId} not found`);
      }

      return user;
    } catch (error) {
      // Log with context
      logStructuredError(this.logger, error, {
        operation: 'getUserById',
        userId,
      });

      // Re-throw known errors
      if (error instanceof UserNotFoundException) {
        throw error;
      }

      // Convert database errors
      if (error instanceof Error && error.message.includes('database')) {
        throw handleDatabaseError(error, 'User fetch');
      }

      throw error;
    }
  }
}
```

## Response Examples

### Success (200)

```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Bad Request (400)

```json
{
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "path": "/api/v1/auth/register",
  "timestamp": "2026-02-24T10:30:00.000Z",
  "details": {
    "password": ["Password must be at least 8 characters"]
  }
}
```

### Unauthorized (401)

```json
{
  "statusCode": 401,
  "code": "INVALID_CREDENTIALS",
  "message": "Invalid email or password",
  "path": "/api/v1/auth/login",
  "timestamp": "2026-02-24T10:30:00.000Z"
}
```

### Forbidden (403)

```json
{
  "statusCode": 403,
  "code": "EMAIL_NOT_VERIFIED",
  "message": "Email has not been verified",
  "path": "/api/v1/auth/login",
  "timestamp": "2026-02-24T10:30:00.000Z"
}
```

### Not Found (404)

```json
{
  "statusCode": 404,
  "code": "USER_NOT_FOUND",
  "message": "User not found",
  "path": "/api/v1/users/507f1f77bcf86cd799439011",
  "timestamp": "2026-02-24T10:30:00.000Z"
}
```

### Conflict (409)

```json
{
  "statusCode": 409,
  "code": "USER_ALREADY_EXISTS",
  "message": "User already exists",
  "path": "/api/v1/auth/register",
  "timestamp": "2026-02-24T10:30:00.000Z"
}
```

### Server Error (500)

```json
{
  "statusCode": 500,
  "code": "INTERNAL_SERVER_ERROR",
  "message": "Internal server error",
  "path": "/api/v1/users",
  "timestamp": "2026-02-24T10:30:00.000Z"
}
```

## Checklist for New Endpoints

- [ ] Import required exception classes
- [ ] Validate input parameters (use DTOs)
- [ ] Check for null/undefined responses
- [ ] Throw specific exceptions, not generic ones
- [ ] Log errors with context using `logStructuredError`
- [ ] Don't catch all errors silently
- [ ] Re-throw known AppException errors
- [ ] Convert database errors to DatabaseException
- [ ] Don't expose internal error messages to clients
- [ ] Add error handling test cases

## Common Mistakes

❌ **Avoid:**

```typescript
// Generic error
throw new Error('Something went wrong');

// console.error
catch (error) { console.error(error); }

// Exposing internal details
throw new Error(`Database error: ${err.query}`);

// Not validating
const user = await userService.find(userId);

// Silent failures
try { ... } catch (error) { }

// Wrong exception type
throw new UserNotFoundException(); // for generic errors
```

✅ **Do:**

```typescript
// Specific exception
throw new InvalidCredentialsException('Invalid email or password');

// Structured logging
logStructuredError(logger, error, { operation: 'login' });

// Safe message
throw new DatabaseException('User fetch failed');

// Validate early
validateMongoId(userId);

// Handle appropriately
try {
  ...
} catch (error) {
  logStructuredError(logger, error, { operation });
  throw error;
}

// Right exception type
throw new InvalidCredentialsException();
```
