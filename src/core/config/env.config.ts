// src/core/config/env.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT ?? '3000'),
  database: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/your-app',
    dbName: process.env.MONGODB_DB_NAME || 'PEGASUS_MONGO',
  },
  accessToken: {
    secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  },
  googleId: {
    id: process.env.GOOGLE_CLIENT_ID,
  },
  mail: {
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    port: process.env.MAIL_PORT,
    host: process.env.MAIL_HOST,
    from: process.env.MAIL_FROM,
    appName: process.env.APP_NAME,
  },
  frontend: {
    frontendUrl: process.env.FRONTEND_URL,
  },
}));
