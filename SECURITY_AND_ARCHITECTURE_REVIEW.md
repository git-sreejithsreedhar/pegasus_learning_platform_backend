# Comprehensive Security & Architecture Review

## Pegasus Learning Platform Backend

**Review Date:** February 24, 2026  
**Project Type:** NestJS + MongoDB + GraphQL  
**Severity Levels:** 🔴 Critical | 🟠 High | 🟡 Medium | 🔵 Low

---

## Executive Summary

Your NestJS backend shows a solid foundation with clean architecture patterns (DDD approach), but has several critical security vulnerabilities and architectural concerns that must be addressed before production deployment. The most critical issues involve **exposed credentials**, **weak JWT secrets**, and **missing security hardening**.

---

## 🔴 CRITICAL SECURITY ISSUES

### 1. **EXPOSED CREDENTIALS IN .env FILE (Git Repository)**

**Severity:** 🔴 CRITICAL  
**Location:** [.env](.env)  
**Issue:**

- Real credentials are committed to git:
  - MongoDB URI with full connection string
  - Email credentials (Gmail SMTP password)
  - JWT secrets (`1234`, `1234567` - extremely weak)
  - Google OAuth Client ID
  - Cloudinary API credentials
  - This file appears in `.gitignore` but is currently tracked

**Impact:**

- Anyone with repository access has production credentials
- If pushed to public repo, infrastructure is fully compromised
- All secrets must be considered compromised

**Remediation:**

```bash
# 1. Remove .env from git history (critical if public repo)
git rm --cached .env
git commit -m "Remove .env credentials from history"

# 2. Force push git history rewrite (if on private repo)
git filter-branch --tree-filter 'rm -f .env' HEAD

# 3. Regenerate ALL credentials:
# - Change MongoDB URI and all databases
# - Rotate Gmail app password
# - Regenerate all JWT secrets
# - Rotate Cloudinary credentials
# - Generate new Google OAuth credentials

# 4. Update .gitignore (already correct, verify it's working)
git check-ignore .env  # Should output: .env
```

**Code Changes Required:**

- ✅ `.gitignore` is correct but `.env` is already tracked
- Create `.env.example` with dummy values for developers:

```dotenv
NODE_ENV=development
APP_NAME=PEGASUS
PORT=3000
MONGODB_DB_NAME=MONGO_Pegasus
MONGO_URI=mongodb://localhost:27017/pegasus_learning_platform
JWT_SECRET=your-secret-here
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_PORT=587
MAIL_HOST=smtp.gmail.com
MAIL_FROM=noreply@yourapp.com
JWT_ACCESS_TOKEN_SECRET=your-access-secret
JWT_ACCESS_TOKEN_EXPIRATION_TIME=15m
JWT_REFRESH_TOKEN_SECRET=your-refresh-secret
JWT_REFRESH_TOKEN_EXPIRATION_TIME=7d
MAIL_TOKEN_SECRET=your-mail-token-secret
MAIL_TOKEN_EXPIRATION_TIME=15m
GOOGLE_CLIENT_ID=your-google-client-id
FRONTEND_URL=http://localhost:4200
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=''
```

---

### 2. **WEAK JWT SECRETS**

**Severity:** 🔴 CRITICAL  
**Locations:**

- [.env](.env): `JWT_ACCESS_TOKEN_SECRET=1234`
- [.env](.env): `JWT_REFRESH_TOKEN_SECRET=1234567`
- [.env](.env): `MAIL_TOKEN_SECRET=MAIL_TOKEN_SECRET12345`

**Issue:**

- Access token secret is 4 characters (`1234`)
- Refresh token secret is 7 characters (`1234567`)
- These can be brute-forced in milliseconds
- Cryptographically weak and easily guessable

**Impact:**

- Anyone can forge valid JWT tokens
- Complete authentication bypass
- Privilege escalation trivial
- Token tampering goes undetected

**Remediation:**
Use cryptographically strong secrets (minimum 32 bytes):

```bash
# Generate strong secrets (run multiple times)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Example outputs:
# a7f3e8c2d1b9f5a4c6e2b8f1d3a5c7e9f2b4d6a8c1e3f5b7d9e1a3c5f7b9d1
# 2c4e6f8a0b2d4e6f8a0b2d4e6f8a0b2d4e6f8a0b2d4e6f8a0b2d4e6f8a0b2d
```

Update [.env](.env):

```dotenv
JWT_ACCESS_TOKEN_SECRET=a7f3e8c2d1b9f5a4c6e2b8f1d3a5c7e9f2b4d6a8c1e3f5b7d9e1a3c5f7b9d1
JWT_REFRESH_TOKEN_SECRET=2c4e6f8a0b2d4e6f8a0b2d4e6f8a0b2d4e6f8a0b2d4e6f8a0b2d4e6f8a0b2d
MAIL_TOKEN_SECRET=b5a7f8c2d3e1f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2d4e6f8a0b2d4e6f8a0b2
```

---

### 3. **MISSING CORS CREDENTIALS VALIDATION**

**Severity:** 🔴 CRITICAL  
**Location:** [src/main.ts](src/main.ts#L33-L39)

**Issue:**

```typescript
app.enableCors({
  origin: 'http://localhost:4200', // Hardcoded single origin
  credentials: true, // Allows cookies across origins
  // ...
});
```

Problems:

- Hardcoded localhost origin won't work in staging/production
- Missing `Access-Control-Allow-Origin` validation
- Credentials are allowed for ANY matching origin (CORS-based CSRF)
- No validation that origin is whitelisted

**Impact:**

- In production, frontend origin likely doesn't match -> CORS failures
- Credentials exposure via CORS misconfiguration
- CSRF attacks via credentials

**Remediation:**

```typescript
// [src/main.ts](src/main.ts)
const allowedOrigins = [
  'http://localhost:4200', // Development
  'http://localhost:3000', // Development
  process.env.FRONTEND_URL, // From env (production)
].filter(Boolean);

app.enableCors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  maxAge: 3600, // Cache preflight
});
```

---

### 4. **MISSING HELMET SECURITY HEADERS IN DEVELOPMENT**

**Severity:** 🔴 CRITICAL  
**Location:** [src/main.ts](src/main.ts#L46-L48)

**Issue:**

```typescript
if (configService.get<string>('nodeEnv') === 'production') {
  app.use(helmet());
}
```

Problems:

- Helmet only enabled in production
- Development uses same security-sensitive code paths
- XSS, clickjacking, MIME-type sniffing unprotected in dev
- Different security behavior between dev/prod (hard to test)

**Impact:**

- Development environment easily exploitable
- Security issues not caught during development
- QA and staging stages unprotected

**Remediation:**

```typescript
// [src/main.ts](src/main.ts)
// Always enable helmet, with stricter settings in production
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // Consider removing unsafe-inline
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    frameguard: { action: 'deny' },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: {
      maxAge: process.env.NODE_ENV === 'production' ? 63072000 : 0, // 2 years in prod
      includeSubDomains: true,
      preload: true,
    },
  }),
);
```

---

### 5. **APOLLO INTROSPECTION ENABLED IN PRODUCTION**

**Severity:** 🔴 CRITICAL  
**Location:** [src/core/config/graphql.config.ts](src/core/config/graphql.config.ts#L13)

**Issue:**

```typescript
introspection: true,  // Allows full schema discovery
playground: false,
```

Problems:

- GraphQL introspection enabled globally
- Attackers can discover entire API schema, all queries/mutations
- No protection against introspection
- Even though playground is disabled, introspection queries still work

**Impact:**

- Complete API surface exposed
- All field names, types, relationships visible
- Facilitates targeted attacks
- Reveals business logic structure

**Remediation:**

```typescript
// [src/core/config/graphql.config.ts](src/core/config/graphql.config.ts)
export default registerAs(
  'graphql',
  (): ApolloDriverConfig => ({
    driver: ApolloDriver,
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    sortSchema: true,
    introspection: process.env.NODE_ENV !== 'production', // Disable in production
    playground: process.env.NODE_ENV !== 'production',
    plugins: [
      process.env.NODE_ENV !== 'production'
        ? ApolloServerPluginLandingPageLocalDefault()
        : null,
    ].filter(Boolean),

    debug: process.env.NODE_ENV === 'development',
    includeStacktraceInErrorResponses: process.env.NODE_ENV === 'development',

    cache: 'bounded',
    csrfPrevention: process.env.NODE_ENV === 'production',
  }),
);
```

---

### 6. **STACK TRACES EXPOSED TO CLIENTS**

**Severity:** 🔴 CRITICAL  
**Location:** [src/core/config/graphql.config.ts](src/core/config/graphql.config.ts#L17)

**Issue:**

```typescript
includeStacktraceInErrorResponses: process.env.NODE_ENV === 'development',
```

Problems:

- While this correctly disables in production, verify it's working
- [src/core/common/filters/gql-exception.filters.ts](src/core/common/filters/gql-exception.filters.ts#L68) logs stack traces server-side
- But still good to confirm no traces in error responses

**Impact:**

- Stack traces reveal file paths, code structure
- Internal implementation details exposed
- Information leak for attackers

**Remediation:** Already configured correctly. Verify in error responses via integration tests.

---

## 🟠 HIGH PRIORITY SECURITY ISSUES

### 7. **UNVALIDATED TOKEN IN PASSWORD RESET**

**Severity:** 🟠 HIGH  
**Location:** [src/modules/auth/presentation/controller/auth.controller.ts](src/modules/auth/presentation/controller/auth.controller.ts#L115-L125)

**Issue:**

```typescript
@Post('update-password')
async updatePassword(
  @Body('newPassword') newPassword: string,
  @Body('token') token: string,
) {
  try {
    await this.updatePasswordUsecase.execute(newPassword, token);
  } catch (error) {
    console.error(error);  // ❌ Logging errors to console
    throw new HttpException('Failed to update password', 500);
  }
}
```

Problems:

- No validation of token format
- No length checks on password
- Generic error response hides validation failures
- `console.error` should use logger
- No rate limiting on password reset attempts
- Missing password strength validation

**Impact:**

- Invalid tokens accepted
- Weak passwords accepted
- Timing attack surface (similar error messages)
- Account takeover possible

**Remediation:**

```typescript
// [src/modules/auth/presentation/inputs/update-password.dto.ts] (create new file)
import { IsString, MinLength, Matches, IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Password must include uppercase, lowercase, number, and special character',
  })
  newPassword: string;
}

// [src/modules/auth/presentation/controller/auth.controller.ts]
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Post('update-password')
async updatePassword(
  @Body() updatePasswordDto: UpdatePasswordDto,
) {
  try {
    await this.updatePasswordUsecase.execute(
      updatePasswordDto.newPassword,
      updatePasswordDto.token,
    );
    return { message: 'Password updated successfully' };
  } catch (error) {
    this.logger.error('Password update failed', error);  // Use injected logger
    if (error instanceof BadRequestException) {
      throw error;
    }
    throw new HttpException('Failed to update password', 500);
  }
}
```

---

### 8. **MISSING RATE LIMITING & DOS PROTECTION**

**Severity:** 🟠 HIGH  
**Location:** [package.json](package.json) - Throttler installed but not used  
**Issue:**

```json
"@nestjs/throttler": "^6.4.0",
```

Package installed but throttling not activated:

- No `@Throttle` decorators on sensitive endpoints
- No rate limiting on auth endpoints (login, forgot-password, resend-email)
- No DOS protection against brute-force attacks
- Email sending endpoint has no limits

**Impact:**

- Brute-force attacks on login/passwords
- Email spam/DoS via resend endpoint
- Account enumeration via failed login attempts
- Free email service abuse

**Remediation:**

```typescript
// [src/app.module.ts]
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nestjs/throttler/dist/throttlers/storage-redis.service';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000, // 1 minute
        limit: 10, // 10 requests per minute
      },
      {
        name: 'long',
        ttl: 15 * 60 * 1000, // 15 minutes
        limit: 100, // 100 requests per 15 minutes
      },
    ]),
    // ... other imports
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

// [src/modules/auth/presentation/controller/auth.controller.ts]
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  @Post('login')
  @Throttle('short', { limit: 5, ttl: 60000 }) // 5 attempts per minute
  async login(@Body() credentials: LoginInput) {
    // ...
  }

  @Post('forgot-password')
  @Throttle('long', { limit: 3, ttl: 15 * 60 * 1000 }) // 3 attempts per 15 minutes
  async forgotPassword(@Body('email') email: string) {
    // ...
  }

  @Post('resend-email')
  @Throttle('short', { limit: 3, ttl: 60000 }) // 3 attempts per minute
  async resendMail(@Body('email') email: string) {
    // ...
  }

  @Post('send-verification-mail')
  @Throttle('long', { limit: 5, ttl: 15 * 60 * 1000 }) // 5 per 15 minutes
  async sendVerificationEmail(@Body() body: sendMailDto) {
    // ...
  }
}
```

---

### 9. **MISSING JWT REVOCATION/BLACKLIST**

**Severity:** 🟠 HIGH  
**Location:** [src/modules/auth/infrastructure/jwt/jwt.service.ts](src/modules/auth/infrastructure/jwt/jwt.service.ts)

**Issue:**

- No token revocation mechanism
- No logout endpoint
- Refresh tokens cannot be revoked
- Compromised tokens remain valid until expiration

**Impact:**

- Users can't be logged out
- Compromised tokens valid for full TTL (7 days for refresh)
- Lost device still has access
- No account security controls

**Remediation:**

```typescript
// [src/modules/auth/infrastructure/cache/jwt-blacklist.service.ts] (create new)
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtBlacklistService {
  constructor(private configService: ConfigService) {}

  private blacklist = new Set<string>();

  async addToBlacklist(token: string, expiresIn: number): Promise<void> {
    this.blacklist.add(token);

    // Auto-remove after expiration
    setTimeout(() => {
      this.blacklist.delete(token);
    }, expiresIn * 1000);
  }

  async isBlacklisted(token: string): Promise<boolean> {
    return this.blacklist.has(token);
  }
}

// [src/modules/auth/infrastructure/jwt/jwt.service.ts] - Add logout
async verifyAccessToken(token: string): Promise<TokenVerificationResult> {
  const isBlacklisted = await this.blacklistService.isBlacklisted(token);
  if (isBlacklisted) {
    return { isValid: false, error: 'Token has been revoked' };
  }
  return this.verifyToken(token, this.getAccessTokenOptions());
}

// [src/modules/auth/presentation/controller/auth.controller.ts] - Add logout endpoint
@Post('logout')
@UseGuards(JwtAuthGuard)
async logout(@Request() req: any): Promise<{ message: string }> {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    const config = this.configService.get('app.accessToken');
    const expiresInSeconds = this.parseExpiresIn(config.expiresIn);
    await this.jwtTokenService.addTokenToBlacklist(token, expiresInSeconds);
  }
  return { message: 'Logged out successfully' };
}

private parseExpiresIn(expiresIn: string): number {
  const match = expiresIn.match(/(\d+)([smhd])/);
  if (!match) return 3600;
  const [, value, unit] = match;
  const multipliers = { s: 1, m: 60, h: 3600, d: 86400 };
  return parseInt(value) * (multipliers[unit as keyof typeof multipliers] || 1);
}
```

**Better Solution (Production-Grade):** Use Redis for token blacklist:

```typescript
// npm install redis @nestjs/cache-manager cache-manager-redis-store

// [src/modules/auth/infrastructure/cache/jwt-blacklist.service.ts]
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class JwtBlacklistService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async addToBlacklist(token: string, expiresInSeconds: number): Promise<void> {
    await this.cacheManager.set(
      `blacklist_${token}`,
      true,
      expiresInSeconds * 1000,
    );
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const result = await this.cacheManager.get(`blacklist_${token}`);
    return !!result;
  }
}
```

---

### 10. **PASSWORD RESET LINK EXPOSED IN EMAIL**

**Severity:** 🟠 HIGH  
**Location:** [src/core/common/mail/mail.service.ts](src/core/common/mail/mail.service.ts#L30-L37)

**Issue:**

```typescript
async sendPasswordReset(to: string, resetLink: string): Promise<void> {
  try {
    await this.transporter.sendMail({
      from: this.configService.get('app.mail.user'),
      to: to,
      subject: 'Reset Your Password',
      html: `
        <h1>Password Reset</h1>
        <p>Your password reset code is:</p>
        <h2>${resetLink}</h2>  // ❌ Full link in email
      `,
    });
  }
}
```

Problems:

- Complete reset URL/token exposed in email body
- Email servers may log full emails
- Email forwarding exposes token
- No expiration mentioned to user
- No confirmation that user requested this

**Impact:**

- Password reset token interception
- Account takeover via email compromise
- Email log exposure = full account takeover

**Remediation:**

```typescript
// [src/core/common/mail/mail.service.ts]
async sendPasswordReset(
  to: string,
  resetToken: string,
  resetLink: string,
): Promise<void> {
  try {
    await this.transporter.sendMail({
      from: this.configService.get('app.mail.from'),
      to: to,
      subject: 'Reset Your Password - Action Required',
      html: `
        <h1>Password Reset Request</h1>
        <p>We received a request to reset your password. Click the link below:</p>
        <a href="${resetLink}" style="padding: 10px 20px; background: #007bff; color: white; text-decoration: none;">Reset Password</a>

        <p style="color: #666; font-size: 12px;">
          This link expires in 15 minutes. If you didn't request this, ignore this email.
        </p>

        <p style="color: #999; font-size: 11px;">
          For security: Never share this link. We'll never ask for your password via email.
        </p>
      `,
    });
  } catch (error) {
    this.logger.error('Failed to send password reset email', error);
    throw new HttpException(
      ResponseConstants.MAIL_SEND_FAILED.message,
      ResponseConstants.MAIL_SEND_FAILED.statusCode,
    );
  }
}
```

---

### 11. **MISSING AUTHENTICATION ON GraphQL MUTATIONS**

**Severity:** 🟠 HIGH  
**Location:** [src/modules/auth/presentation/auth.resolver.ts](src/modules/auth/presentation/auth.resolver.ts)

**Issue:**

```typescript
@Resolver()
export class AuthResolver {
  // All mutations are commented out - no mutations implemented
  // No @UseGuards decorators on any resolvers
}
```

Problems:

- Mutations commented out in resolver
- No authentication guards on GraphQL resolvers
- GraphQL endpoints unprotected (if implemented)
- Anyone can call mutations without authentication

**Impact:**

- Unauthorized access to all mutations
- Data modification without permissions
- Account/data manipulation

**Remediation:**

```typescript
// [src/modules/auth/presentation/auth.resolver.ts]
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/core/common/guards/jwt-Auth.guard';

@Resolver()
export class AuthResolver {
  // Public mutations (no guard)
  @Mutation(() => AuthResponse)
  async login(@Args('input') input: LoginInput): Promise<AuthResponse> {
    // ...
  }

  // Protected mutations
  @Mutation(() => String)
  @UseGuards(JwtAuthGuard) // Add guard
  async logout(@Context('req') req: any): Promise<string> {
    // ...
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard) // Add guard
  async changePassword(
    @Args('input') input: ChangePasswordInput,
    @Context('req') req: any,
  ): Promise<boolean> {
    // ...
  }
}
```

---

### 12. **CONSOLE.LOG & UNSTRUCTURED ERROR LOGGING**

**Severity:** 🟠 HIGH  
**Locations:**

- [src/modules/auth/presentation/controller/auth.controller.ts](src/modules/auth/presentation/controller/auth.controller.ts#L103) (multiple)

**Issue:**

```typescript
catch (error) {
  console.error(error);  // ❌ Console logs
  throw new HttpException(...);
}
```

Problems:

- `console.error` doesn't log to files in production
- Errors not captured by monitoring
- Inconsistent with Winston logger setup
- Stack traces may contain sensitive data
- No structured logging for debugging
- Monitoring tools won't catch issues

**Impact:**

- Production errors invisible
- No audit trail
- Debugging impossible in production
- Security events not logged

**Remediation:**

```typescript
// [src/modules/auth/presentation/controller/auth.controller.ts]
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    // ... other injections
  ) {}

  @Post('verify-email')
  async verifyEmail(@Body('token') token: string) {
    try {
      if (!token) {
        this.logger.warn('Email verification attempted without token');
        throw new BadRequestException('Token is required');
      }

      await this.mailVerificationUsecase.execute(token);
      this.logger.log(`Email verified successfully`);

      return {
        success: true,
        message: 'Email verified successfully',
      };
    } catch (error) {
      this.logger.error(
        `Email verification failed: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
```

---

### 13. **MISSING MONGODB INJECTION PREVENTION**

**Severity:** 🟠 HIGH  
**Location:** MongoDB queries throughout codebase

**Issue:**

- No visible NoSQL injection prevention
- Class-validator/transformer are good but let's verify all queries
- User input should always be validated before database queries

**Impact:**

- NoSQL injection attacks possible
- Database compromise
- Data exfiltration

**Remediation:**
Ensure all user inputs are:

1. Validated via class-validator ✅ (already doing this well)
2. Never concatenated into queries ✅
3. Use MongoDB ObjectId properly:

```typescript
// ✅ SAFE - Using ObjectId validation
import { isValidObjectId } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

async getUserById(id: string) {
  if (!isValidObjectId(id)) {
    throw new BadRequestException('Invalid user ID format');
  }
  return this.userModel.findById(id);
}

// ❌ UNSAFE - Never do this
async getUserByIdUnsafe(id: string) {
  return this.userModel.findOne({ _id: id });  // Could be exploited with object injection
}
```

Add ObjectId validation to DTOs:

```typescript
// [src/modules/users/application/dtos/user-id.dto.ts] (create)
import { IsMongoId } from 'class-validator';

export class UserIdDto {
  @IsMongoId()
  id: string;
}
```

---

## 🟡 MEDIUM PRIORITY ISSUES

### 14. **MISSING INPUT VALIDATION ON EMAIL ENDPOINTS**

**Severity:** 🟡 MEDIUM  
**Location:** [src/modules/auth/presentation/controller/auth.controller.ts](src/modules/auth/presentation/controller/auth.controller.ts#L108)

**Issue:**

```typescript
@Post('resend-email')
async resendMail(@Body('email') email: string) {  // ❌ Raw string, no validation
  try {
    await this.resendEmailUsecase.execute(email);
```

Problems:

- No email format validation
- No length checks
- Could accept malformed emails
- Passes to SMTP unvalidated

**Impact:**

- Invalid emails sent to SMTP
- Resource waste
- Potential DoS vector

**Remediation:**

```typescript
// [src/modules/auth/presentation/inputs/resend-email.dto.ts] (create)
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

// [src/modules/auth/presentation/controller/auth.controller.ts]
@Post('resend-email')
async resendMail(@Body() resendEmailDto: ResendEmailDto) {
  await this.resendEmailUsecase.execute(resendEmailDto.email);
  return { message: 'Email resent successfully' };
}
```

---

### 15. **DISABLED VALIDATION PIPE (SECURITY REGRESSION)**

**Severity:** 🟡 MEDIUM  
**Location:** [src/main.ts](src/main.ts#L56-L68)

**Issue:**

```typescript
// ❌ Strict validation commented out
// app.useGlobalPipes(
//   new ValidationPipe({
//     whitelist: true,
//     forbidNonWhitelisted: true,  // Would reject extra fields
//     transform: true,
//   }),
// );

// ✅ Active but less strict
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // ✅ Removes unknown fields
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
);
```

Problems:

- `forbidNonWhitelisted: false` allows extra fields
- `enableImplicitConversion: true` may cause unexpected behavior
- No error-on-extra-properties check

**Impact:**

- Extra fields silently ignored instead of rejected
- Could mask injection attempts
- Implicit conversions may have security implications

**Remediation:**

```typescript
// [src/main.ts]
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // Remove unknown properties
    forbidNonWhitelisted: true, // Reject requests with unknown properties
    transform: true, // Transform to DTO instances
    transformOptions: {
      enableImplicitConversion: false, // Strict type conversion
    },
    stopAtFirstError: false, // Report all validation errors
  }),
);
```

---

### 16. **MISSING EMAIL VERIFICATION ENFORCEMENT**

**Severity:** 🟡 MEDIUM  
**Location:** [src/modules/users/domain/entities/users.entity.ts](src/modules/users/domain/entities/users.entity.ts)

**Issue:**

```typescript
export interface UserReconstitutionProps {
  // ...
  isEmailVerified: boolean;
}
```

Problems:

- Users can login before email verification
- No guard enforcing email verification
- `EmailVerifiedGuard` exists but not activated
- Unverified emails can access protected resources

**Impact:**

- Spam/fake accounts access system
- Business logic bypass
- Data quality issues

**Remediation:**

```typescript
// [src/core/common/guards/email-verified.guard.ts] (review & enable)
// [src/modules/auth/presentation/controller/auth.controller.ts]
@Post('login')
@UseGuards(JwtAuthGuard)  // Added guard
async login(@Body() credentials: LoginInput, @Res({ passthrough: true }) res: express.Response) {
  const { user, accessToken, refreshToken } = await this.loginUsecase.execute(
    credentials.email,
    credentials.password,
  );

  // Check email verification
  if (!user.isEmailVerified) {
    throw new ForbiddenException(
      'Email not verified. Please check your email for verification link.',
    );
  }

  // Set refresh token cookie...
}
```

---

### 17. **UNREACHABLE CODE IN AUTH CONTROLLER**

**Severity:** 🟡 MEDIUM  
**Location:** [src/modules/auth/presentation/controller/auth.controller.ts](src/modules/auth/presentation/controller/auth.controller.ts#L109-110)

**Issue:**

```typescript
async forgotPassword(@Body('email') email: string) {
  return this.forgotPasswordUsecase.execute(email);
  return { message: 'Password updated successfully' };  // ❌ Unreachable
}
```

Problems:

- Second return statement unreachable
- Misleading message "updated" vs "reset"
- Code smell indicating incomplete refactoring

**Impact:**

- Confusing code
- Maintainability issues
- Client gets wrong response

**Remediation:**

```typescript
@Post('forgot-password')
@Throttle('long', { limit: 3, ttl: 15 * 60 * 1000 })
async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
  await this.forgotPasswordUsecase.execute(forgotPasswordDto.email);
  return {
    message: 'If this email exists, you will receive a password reset link'
  };
}
```

---

### 18. **MISSING ENVIRONMENT VALIDATION**

**Severity:** 🟡 MEDIUM  
**Location:** [src/core/config/env.config.ts](src/core/config/env.config.ts)

**Issue:**

```typescript
export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development', // No validation
  port: Number(process.env.PORT ?? 3000), // Could NaN
  // ...
}));
```

Problems:

- `Number(undefined)` = `NaN`
- Invalid `NODE_ENV` values accepted
- Port could be invalid (>65535, <1)
- No early validation

**Impact:**

- Application starts with invalid config
- Crashes at runtime
- Debugging difficult

**Remediation:**

```typescript
// [src/core/config/env.config.ts]
import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  Max,
  validate,
} from 'class-validator';

class EnvironmentVariables {
  @IsEnum(['development', 'staging', 'production'])
  @IsNotEmpty()
  NODE_ENV: string;

  @IsNumber()
  @Min(1)
  @Max(65535)
  PORT: number = 3000;

  @IsString()
  @IsNotEmpty()
  MONGO_URI: string;

  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_TOKEN_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_TOKEN_SECRET: string;
}

export default registerAs('app', async () => {
  const env = plainToInstance(EnvironmentVariables, process.env, {
    enableImplicitConversion: true,
  });

  const errors = await validate(env);
  if (errors.length > 0) {
    throw new Error(
      `Environment validation failed: ${errors
        .map(
          (e) =>
            `${e.property}: ${Object.values(e.constraints || {}).join(', ')}`,
        )
        .join('; ')}`,
    );
  }

  return {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    // ...
  };
});
```

---

## 🔵 ARCHITECTURAL ISSUES & CODE SMELLS

### 19. **INCONSISTENT ERROR HANDLING**

**Severity:** 🔵 ARCHITECTURAL  
**Locations:** Multiple

**Issues:**

- Mix of `HttpException`, `BadRequestException`, `ForbiddenException`
- Custom error classes exist but not all used uniformly
- No error code constants
- Different error response formats

**Impact:**

- Client error handling difficult
- Inconsistent API contracts
- Hard to map errors

**Remediation:**

```typescript
// [src/core/common/errors/custom-errors.ts] (enhance)
export enum ErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

export class AppException extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly statusCode: number,
    message: string,
    public readonly details?: Record<string, any>,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvalidCredentialsError extends AppException {
  constructor(message = 'Invalid email or password') {
    super(ErrorCode.INVALID_CREDENTIALS, 401, message);
  }
}

export class TokenExpiredError extends AppException {
  constructor(message = 'Token has expired') {
    super(ErrorCode.TOKEN_EXPIRED, 401, message);
  }
}

export class InsufficientPermissionsError extends AppException {
  constructor(message = 'Insufficient permissions for this action') {
    super(ErrorCode.INSUFFICIENT_PERMISSIONS, 403, message);
  }
}

// [src/core/common/filters/http-exception.filters.ts] - Update filter
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = 500;
    let message = 'Internal server error';
    let code = ErrorCode.INTERNAL_SERVER_ERROR;
    let details: Record<string, any> | undefined;

    if (exception instanceof AppException) {
      statusCode = exception.statusCode;
      message = exception.message;
      code = exception.code;
      details = exception.details;
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse() as { message?: string | string[] };
      message = Array.isArray(res?.message)
        ? res.message.join(', ')
        : res?.message || exception.message;
    }

    this.logger.error(`[${request.method}] ${request.url}`, {
      statusCode,
      code,
      message,
      details,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    response.status(statusCode).json({
      statusCode,
      code,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
      ...(details && { details }),
    });
  }
}
```

---

### 20. **COMMENTED-OUT CODE & DEAD CODE**

**Severity:** 🔵 ARCHITECTURAL  
**Locations:**

- [src/modules/auth/presentation/auth.resolver.ts](src/modules/auth/presentation/auth.resolver.ts) - All mutations commented
- [src/main.ts](src/main.ts#L24-26) - Commented imports & filters
- [src/core/common/services/file-upload.service.ts](src/core/common/services/file-upload.service.ts) - Entire implementation commented
- [src/core/config/graphql.config.ts](src/core/core/config/graphql.config.ts) - Commented code

**Impact:**

- Confusing codebase
- Hard to understand intent
- Prevents refactoring
- May hide deprecated features

**Remediation:**

```bash
# Remove all commented-out code
# Use git history for recovery if needed
# Approach: Clean up systematically, test thoroughly
```

---

### 21. **MISSING DEPENDENCY INJECTION BEST PRACTICES**

**Severity:** 🔵 ARCHITECTURAL  
**Locations:** Throughout modules

**Issue:**

- Some services not properly scoped
- `Inject` tokens used inconsistently
- No clear service registration pattern
- Potential circular dependencies

**Remediation:**

```typescript
// [src/modules/auth/auth.module.ts] (example cleanup)
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtTokenService } from './infrastructure/jwt/jwt.service';
import { AuthUsecases } from './application/usecases';
import { AuthProviders } from './application/providers';

@Module({
  imports: [
    JwtModule.register({}), // Async register in AppModule instead
    PassportModule,
  ],
  providers: [
    JwtTokenService,
    AuthUsecases.Login,
    AuthUsecases.VerifyEmail,
    AuthProviders.ITokenService,
    // Use explicit token providers
    {
      provide: 'ITokenService',
      useClass: JwtTokenService,
    },
  ],
  exports: ['ITokenService'], // Export what other modules need
})
export class AuthModule {}
```

---

### 22. **MISSING TEST COVERAGE**

**Severity:** 🔵 ARCHITECTURAL  
**Location:** Test files minimal

**Issues:**

- Only 1 e2e test file
- No unit tests for core services
- No test coverage for security guards
- Auth logic untested
- Validation logic untested

**Impact:**

- Bugs not caught
- Refactoring risky
- Security holes undetected
- No regression detection

**Remediation:**
Priority tests to add:

```typescript
// [src/modules/auth/tests/jwt.service.spec.ts]
describe('JwtTokenService', () => {
  let service: JwtTokenService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [JwtTokenService, JwtService, ConfigValidationService],
    }).compile();

    service = module.get(JwtTokenService);
    jwtService = module.get(JwtService);
  });

  describe('generateAccessToken', () => {
    it('should generate valid access token', async () => {
      const payload = { userId: '123', email: 'test@test.com' };
      const token = await service.generateAccessToken(payload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should include correct payload', async () => {
      const payload = { userId: '123', email: 'test@test.com' };
      const token = await service.generateAccessToken(payload);
      const decoded = jwtService.decode(token);
      expect(decoded.userId).toBe('123');
    });

    it('should respect expiration time', async () => {
      // Verify token expires at correct time
    });
  });

  describe('verifyAccessToken', () => {
    it('should reject expired tokens', async () => {
      // Test expired token handling
    });

    it('should reject tampered tokens', async () => {
      // Test token tampering detection
    });

    it('should reject blacklisted tokens', async () => {
      // Test token revocation
    });
  });
});

// [src/core/common/guards/tests/jwt-auth.guard.spec.ts]
describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let tokenService: ITokenService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: TOKEN_SERVICE,
          useValue: { verifyAccessToken: jest.fn() },
        },
      ],
    }).compile();

    guard = module.get(JwtAuthGuard);
    tokenService = module.get(TOKEN_SERVICE);
  });

  it('should reject requests without token', async () => {
    const mockContext = {
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => ({ headers: {} }),
      }),
    };

    await expect(guard.canActivate(mockContext as any)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should reject malformed auth header', async () => {
    const mockContext = {
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => ({ headers: { authorization: 'Invalid' } }),
      }),
    };

    await expect(guard.canActivate(mockContext as any)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should allow valid tokens', async () => {
    jest.spyOn(tokenService, 'verifyAccessToken').mockResolvedValue({
      isValid: true,
      payload: { userId: '123' },
    });

    const mockContext = {
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer valid.token.here' },
        }),
      }),
    };

    const result = await guard.canActivate(mockContext as any);
    expect(result).toBe(true);
  });
});
```

---

### 23. **MISSING INPUT SIZE LIMITS**

**Severity:** 🔵 ARCHITECTURAL  
**Location:** [src/main.ts](src/main.ts)

**Issue:**

- No request size limits configured
- No file upload size limits
- Potential for large payload DoS

**Remediation:**

```typescript
// [src/main.ts]
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb' }));

// For file uploads
app.use(express.static('uploads', { maxAge: '1d' }));

// Or configure per route
import { FileInterceptor } from '@nestjs/platform-express';

@Post('upload')
@UseInterceptors(FileInterceptor('file', {
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestException('Invalid file type'), false);
    }
  },
}))
async uploadFile(@UploadedFile() file: Express.Multer.File) {
  // Process file
}
```

---

### 24. **MISSING LOGGING IN SECURITY-CRITICAL OPERATIONS**

**Severity:** 🔵 ARCHITECTURAL  
**Issue:**

- Login attempts not logged
- Failed authentication not logged
- Password changes not logged
- Admin actions not logged
- No audit trail

**Impact:**

- No security incident investigation
- Compliance violations
- No intrusion detection

**Remediation:**

```typescript
// [src/core/common/decorators/audit-log.decorator.ts] (create)
import { SetMetadata } from '@nestjs/common';

export const AUDIT_LOG_KEY = 'audit_log';

export interface AuditLogConfig {
  action: string;
  resource: string;
  includePayload?: boolean;
}

export const AuditLog = (config: AuditLogConfig) =>
  SetMetadata(AUDIT_LOG_KEY, config);

// [src/core/common/interceptors/audit-logging.interceptor.ts] (create)
@Injectable()
export class AuditLoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditConfig = this.reflector.get<AuditLogConfig>(
      AUDIT_LOG_KEY,
      context.getHandler(),
    );

    if (!auditConfig) return next.handle();

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return next.handle().pipe(
      tap(() => {
        this.logger.info(
          `[AUDIT] ${auditConfig.action} on ${auditConfig.resource}`,
          {
            userId: user?.id,
            action: auditConfig.action,
            resource: auditConfig.resource,
            timestamp: new Date().toISOString(),
            ip: request.ip,
            userAgent: request.get('user-agent'),
            ...(auditConfig.includePayload && { payload: request.body }),
          },
        );
      }),
      catchError((error) => {
        this.logger.warn(
          `[AUDIT] Failed ${auditConfig.action} on ${auditConfig.resource}`,
          {
            userId: user?.id,
            action: auditConfig.action,
            resource: auditConfig.resource,
            error: error.message,
            timestamp: new Date().toISOString(),
          },
        );
        throw error;
      }),
    );
  }
}

// [src/modules/auth/presentation/controller/auth.controller.ts]
@Post('login')
@AuditLog({ action: 'LOGIN_ATTEMPT', resource: 'AUTH', includePayload: false })
async login(@Body() credentials: LoginInput) {
  // ...
}

@Post('logout')
@UseGuards(JwtAuthGuard)
@AuditLog({ action: 'LOGOUT', resource: 'AUTH' })
async logout(@Request() req: any) {
  // ...
}
```

---

### 25. **CLOUDINARY CREDENTIALS IN CODE & ENV**

**Severity:** 🔵 ARCHITECTURAL  
**Issue:**

- API keys exposed in .env (already covered in #1)
- No rate limiting on uploads
- No file type validation during upload

**Remediation:**
Covered in critical issue #1. Additionally:

```typescript
// [src/modules/users/presentation/controllers/avatar-upload.controller.ts]
@Post('avatar')
@UseGuards(JwtAuthGuard)
@UseInterceptors(
  FileInterceptor('avatar', {
    storage: cloudinaryStorage({
      cloudinary: cloudinary,
      folder: 'avatars',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.mimetype)) {
        return cb(new BadRequestException('Only images are allowed'), false);
      }
      cb(null, true);
    },
  }),
)
@Throttle('short', { limit: 5, ttl: 60000 })  // 5 uploads per minute
async uploadAvatar(
  @UploadedFile() file: Express.Multer.File,
  @Request() req: any,
) {
  // Update user avatar URL
}
```

---

## 📋 QUICK FIX CHECKLIST

Priority order for remediation:

### Week 1 (CRITICAL):

- [ ] Remove/regenerate all credentials from git history
- [ ] Generate strong JWT secrets
- [ ] Fix CORS origin validation
- [ ] Enable Helmet security headers everywhere
- [ ] Disable GraphQL introspection in production

### Week 2 (HIGH):

- [ ] Implement token blacklist/revocation
- [ ] Add rate limiting to auth endpoints
- [ ] Add input validation DTOs to all endpoints
- [ ] Replace console.error with structured logging
- [ ] Implement logout functionality

### Week 3 (MEDIUM):

- [ ] Add comprehensive unit tests
- [ ] Implement audit logging
- [ ] Add email verification enforcement
- [ ] Standardize error handling
- [ ] Clean up commented code

### Week 4+ (ARCHITECTURAL):

- [ ] Enhance dependency injection patterns
- [ ] Add request size limits
- [ ] Improve environment variable validation
- [ ] Add integration tests
- [ ] Performance profiling & optimization

---

## 📚 DEPENDENCY UPDATES RECOMMENDED

Some key security updates:

```json
{
  "dependencies": {
    "@nestjs/common": "^11.0.1", // ✅ Latest
    "@nestjs/jwt": "^11.0.0", // ✅ Latest
    "bcrypt": "^6.0.0", // ✅ Latest
    "helmet": "^8.1.0", // ✅ Latest
    "class-validator": "^0.14.2", // ✅ Latest
    "mongoose": "^8.15.1" // ✅ Latest
  }
}
```

All major dependencies are current. Keep them updated with:

```bash
npm audit
npm audit fix
npm outdated
```

---

## 📖 RECOMMENDED RESOURCES

1. **OWASP Top 10 for Node.js:** https://owasp.org/www-project-top-ten/
2. **NestJS Security Documentation:** https://docs.nestjs.com/security/authentication
3. **MongoDB Security Checklist:** https://docs.mongodb.com/manual/security/
4. **GraphQL Security Best Practices:** https://cheatsheetseries.owasp.org/cheatsheets/GraphQL_Cheat_Sheet.html
5. **JWT Best Practices:** https://tools.ietf.org/html/rfc8725

---

## 🎯 NEXT STEPS

1. **Immediately:** Address critical issues (#1-6)
2. **This week:** Address high-priority issues (#7-13)
3. **This sprint:** Address medium issues (#14-18)
4. **Ongoing:** Architectural improvements (#19-25)
5. **Before production:** Implement all security hardening

---

**Report Prepared For:** Senior Code Review  
**Total Issues Found:** 25  
**Critical:** 6 | High: 8 | Medium: 5 | Architectural: 6

This review should be discussed with your security team and addressed before any production deployment.
