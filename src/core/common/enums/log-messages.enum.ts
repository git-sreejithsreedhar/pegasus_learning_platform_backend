export enum LogMessages {
  USER_CREATED = 'User created successfully',
  USER_NOT_FOUND = 'User not found',
  USER_BLOCKED = 'User is blocked. Contact support team',
  LOGIN_SUCCESS = 'User logged in successfully',
  LOGIN_FAILED = 'Invalid credentials',
  // Token error messages
  TOKEN_INVALID = 'Invalid authentication token',
  TOKEN_EXPIRED = 'Token has expired',
  TOKEN_GENERATION_FAILED = 'Failed to generate token',
  TOKEN_VERIFICATION_FAILED = 'TOKEN_VERIFICATION_FAILED',
  // Mail error messages
  MAIL_AUTH_FAILED = 'Mail server authentication failed',
  MAIL_CONNECTION_TIMEOUT = 'Mail server connection timed out',
  MAIL_SEND_FAILED = 'Failed to send email due to server error',
  MAIL_INVALID_RECIPIENT = 'Invalid or refused recipient address',
  MAIL_SERVICE_UNAVAILABLE = 'Mail service is temporarily unavailable',
  MAIL_CONFIG_INVALID = 'Mail service configuration error (e.g., missing host/port)',
  MAIL_NOT_VERIFIED = 'Mail is verified. Verify your email',
  USER_NOT_AUTHENTICATED = 'User not authenticated',

  FILE_UPLOAD_ERROR = 'File upload failed',
  SERVER_ERROR = 'Internal server error',
}
