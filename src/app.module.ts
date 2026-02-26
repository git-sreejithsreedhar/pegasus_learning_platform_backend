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
import * as Joi from 'joi';

import databaseConfig from './core/database/database.config';
import envConfig from './core/config/env.config';
import graphqlConfig from './core/config/graphql.config';
import { MentorModule } from './modules/mentor/mentor.module';
import { AdminModule } from './modules/admin/admin.module';
// import { APP_GUARD } from '@nestjs/core';
// import { JwtAuthGuard } from './core/common/guards/jwt-Auth.guard';
// import { RolesGuard } from './core/common/guards/roles.guard';
import { AppGqlExceptionFilter } from './core/common/filters/gql-exception.filters';
import { HttpExceptionFilter } from './core/common/filters/http-exception.fillters';
import { DomainExceptionFilter } from './core/common/filters/domain-exception.filter';

@Module({
  imports: [
    // logger setup
    WinstonModule.forRoot(winstonConfig),

    //ENV configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig, graphqlConfig, envConfig],

      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),

        PORT: Joi.number().default(3000),

        MONGO_URI: Joi.string().required(),
        MONGODB_DB_NAME: Joi.string().required(),

        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        MAIL_TOKEN_SECRET: Joi.string().required(),

        MAIL_USER: Joi.string().optional(),
        MAIL_PASSWORD: Joi.string().optional(),
        MAIL_HOST: Joi.string().optional(),

        FRONTEND_URL: Joi.string().required(),
        GOOGLE_CLIENT_ID: Joi.string().required(),

        CLOUDINARY_CLOUD_NAME: Joi.string().required(),
        CLOUDINARY_API_KEY: Joi.string().required(),
        CLOUDINARY_API_SECRET: Joi.string().required(),
      }),
    }),
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   envFilePath: '.env',
    //   load: [databaseConfig, graphqlConfig, envConfig],
    // }),

    // Graphql setup
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: graphqlConfig,
    }),

    // JWT module
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        signOptions: { issuer: 'Pegasus-App' },
      }),
    }),

    // Database
    MongoProvider,

    // Feature Modules
    AuthModule,
    UsersModule,
    MentorModule,
    AdminModule,
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

    HttpExceptionFilter,
    AppGqlExceptionFilter,
    DomainExceptionFilter,

    // { provide: APP_GUARD, useClass: RolesGuard },
    // { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {
  constructor() {
    // private readonly configValidationService: ConfigValidationService,
    // Validate entire app configuration on startup
    // this.configValidationService.validateAppConfig();
  }
}
