export interface GeneratedTokens {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  userid: string;
  email: string;
  role: string;
  key?: unknown;
}

export interface TokenVerificationResult {
  isValid: boolean;
  payload?: TokenPayload;
  error?: string;
}

export interface TokenService {
  // Token generation
  generateAccessToken(payload: object): Promise<string>;
  generateRefreshToken(payload: object): Promise<string>;
  generateTokenPair(payload: object): Promise<GeneratedTokens>;

  // token verification
  verifyAccessToken(token: string): Promise<TokenVerificationResult>;
  verifyRefreshToken(token: string): Promise<TokenVerificationResult>;

  // Token management
  revokeToken?(token: string): Promise<void>;
}
