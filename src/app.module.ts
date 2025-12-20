import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { MongoProvider } from './core/database/mongo.provider';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigValidationService } from './core/config/config-validation.service';
import { JwtTokenService } from './modules/auth/infrastructure/jwt/jwt.service';
import { AppResolver } from './app.resolver';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './core/config/logger.config';

import databaseConfig from './core/database/database.config';
import envConfig from './core/config/env.config';
import graphqlConfig from './core/config/graphql.config';
import { MentorModule } from './modules/mentor/mentor.module';

@Module({
  imports: [
    // logger setup
    WinstonModule.forRoot(winstonConfig),

    //ENV configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig, graphqlConfig, envConfig],
    }),

    // Graphql setup
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: graphqlConfig,
    }),

    // JWT module
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        signOptions: { issuer: 'Pegasus-App' },
      }),
      // inject: [ConfigService],
    }),

    // Database
    MongoProvider,

    // Feature Modules
    AuthModule,
    UsersModule,
    MentorModule,
  ],
  controllers: [AppController],
  providers: [
    AppResolver,
    AppService,
    ConfigValidationService,
    JwtTokenService,
    {
      provide: JwtTokenService,
      useClass: JwtTokenService,
    },
  ],
})
export class AppModule {
  constructor(
    private readonly configValidationService: ConfigValidationService,
  ) {
    // Validate entire app configuration on startup
    this.configValidationService.validateAppConfig();
  }
}
