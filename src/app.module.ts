import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { MongoProvider } from './core/database/mongo.provider';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TutorsModule } from './modules/tutors/tutors.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigValidationService } from './core/config/config-validation.service';
import { JwtTokenService } from './modules/auth/infrastructure/jwt/jwt.service';
import { AppResolver } from './app.resolver';

import databaseConfig from './core/database/database.config';
import envConfig from './core/config/env.config';
import graphqlConfig from './core/config/graphql.config';

@Module({
  imports: [
<<<<<<< Updated upstream
    // environment Module
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   envFilePath: '.env',
    // }),

    //configuration
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   load: [databaseConfig],
    // }),

=======
    // logger setup
    WinstonModule.forRoot(winstonConfig),

    //ENV configuration
>>>>>>> Stashed changes
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig, graphqlConfig, envConfig], // you can load multiple configs
    }),

    // Graphql setup
<<<<<<< Updated upstream
    // GraphQLModule.forRootAsync<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: true,
    //   useFactory: graphqlConfig,
    // }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
=======
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
>>>>>>> Stashed changes
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
    TutorsModule,
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
