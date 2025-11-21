import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: process.env.MONGO_URI || 'mongodb://localhost:27017',
  dbName: process.env.MONGODB_DB_NAME || 'App',
}));
