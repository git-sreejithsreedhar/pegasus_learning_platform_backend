import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import type { Connection } from 'mongoose';

export const MongoProvider = MongooseModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const logger = new Logger('MongoProvider');

    return {
      uri: configService.get<string>('database.uri'),
      dbName: configService.get<string>('database.dbName'),

      connectionFactory: async (
        connection: Connection,
      ): Promise<Connection> => {
        try {
          // Wait until the connection is ready
          await connection.asPromise();

          // Safely access .name (typed via mongoose.Connection)
          logger.log(`MongoDB connected successfully to: ${connection.name}`);
        } catch (err) {
          //  Narrow unknown to Error for type safety
          if (err instanceof Error) {
            logger.error(`MongoDB connection failed: ${err.message}`);
          } else {
            logger.error('MongoDB connection failed due to an unknown error');
          }
        }

        return connection;
      },
    };
  },
});
