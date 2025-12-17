import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import { ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER, WinstonModule } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';
import { HttpExceptionFilter } from './core/common/filters/http-exception.fillters';
import { GqlHttpExceptionFilter } from './core/common/filters/gql-exception.filters';
import { GlobalLoggingInterceptor } from './core/common/intercetors/global-logging.interceptor';
import { winstonConfig } from './core/config/logger.config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
  });

  app.setGlobalPrefix('api/v1');

  if (configService.get<string>('nodeEnv') === 'production') {
    app.use(helmet());
  }

  app.use(compression());
  app.use(cookieParser());

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     transform: true,
  //   }),
  // );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Get logger
  const logger = app.get<WinstonLogger>(WINSTON_MODULE_PROVIDER);

  // Interceptor
  // app.useGlobalInterceptors(new GlobalLoggingInterceptor(logger));

  // Filters — ONLY ONCE
  app.useGlobalFilters(
    new HttpExceptionFilter(logger),
    // new GqlHttpExceptionFilter(logger),
  );

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  logger.info(`Server running on port ${port}`);
}

void bootstrap();
