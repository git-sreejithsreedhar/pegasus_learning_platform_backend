import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './core/database/database.config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import graphqlConfig from './core/config/graphql.config';
import { MongoProvider } from './core/database/mongo.provider';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TutorsModule } from './modules/tutors/tutors.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigValidationService } from './core/config/config-validation.service';
import { JwtTokenService } from './modules/auth/infrastructure/jwt/jwt.service';
import envConfig from './core/config/env.config';
import { AppResolver } from './app.resolver';

@Module({
  imports: [
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

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig, graphqlConfig, envConfig], // you can load multiple configs
    }),

    // Graphql setup
    // GraphQLModule.forRootAsync<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: true,
    //   useFactory: graphqlConfig,
    // }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      ...graphqlConfig(),
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
