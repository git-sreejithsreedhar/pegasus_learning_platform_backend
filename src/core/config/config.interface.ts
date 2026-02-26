// src/core/config/config.interface.ts
export interface AppConfig {
  nodeEnv: string;
  port: number;

  database: {
    uri: string;
    dbName: string;
  };

  accessToken: {
    secret: string;
    expiresIn: string;
  };

  refreshToken: {
    secret: string;
    expiresIn: string;
  };

  mailVerificationToken: {
    secret: string;
    expiresIn: string;
  };

  googleId: {
    id: string;
  };

  mail: {
    user: string;
    password: string;
    port: string;
    host: string;
    from: string;
    appName: string;
  };

  frontend: {
    frontendUrl: string;
  };

  cloudinary: {
    cloudName?: string;
    apiKey?: string;
    apiSecret?: string;
    folder?: string;
  };
}

export interface TokenConfig {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  mailVerificationTokenSecret: string;
  mailVerificationTokenExpiry: string;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
  issuer: string;
}

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  folder?: string;
}
