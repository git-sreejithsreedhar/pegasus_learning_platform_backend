// export interface TokenObject{}

export interface TokenConfig {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
  issuer: string;
}

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
}
