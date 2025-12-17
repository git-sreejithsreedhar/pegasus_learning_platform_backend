export interface GeneratedTokens {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  userId: string;
  email?: string;
  role?: string;
  // key?: unknown;
  iat?: number;
  exp?: number;
}

export interface TokenVerificationResult {
  isValid: boolean;
  payload?: TokenPayload;
  error?: string;
}

export interface ITokenService {
  // Token generation
  generateAccessToken(payload: object): Promise<string>;
  generateRefreshToken(payload: object): Promise<string>;
  generateTokenPair(payload: object): Promise<GeneratedTokens>;
  createEmailVerificationToken(payload: object): Promise<string>;

  // token verification
  verifyAccessToken(token: string): Promise<TokenVerificationResult>;
  verifyRefreshToken(token: string): Promise<TokenVerificationResult>;
  verifyEmailVerificationToken(token: string): Promise<TokenVerificationResult>;

  // Token management
  revokeToken?(token: string): Promise<void>;
}
