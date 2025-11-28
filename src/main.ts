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
  // const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL') || '*',
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  if (configService.get<string>('nodeEnv') === 'production') {
    app.use(helmet());
    // app.enableCors({ origin: 'https://yourdomain.com' });
  } else {
    // app.use(helmet({ contentSecurityPolicy: false }));
    // app.enableCors({ origin: '*' });
  }
  app.use(compression());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // parsing cookies
  app.use(cookieParser());

  // Get actual Winston instance
  const logger = app.get<WinstonLogger>(WINSTON_MODULE_PROVIDER);

  // instance for the interceptor
  app.useGlobalInterceptors(new GlobalLoggingInterceptor(logger));

  // instance for filters
  app.useGlobalFilters(
    new HttpExceptionFilter(logger),
    new GqlHttpExceptionFilter(logger),
  );

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  logger.info(`Server running on port ${port}`);
}

void bootstrap();
