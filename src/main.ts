import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import { ValidationPipe, Logger, BadRequestException } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { HttpExceptionFilter } from './core/common/filters/http-exception.fillters';
import { winstonConfig } from './core/config/logger.config';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigValidationService } from './core/config/config-validation.service';
import { AppGqlExceptionFilter } from './core/common/filters/gql-exception.filters';
import { DomainExceptionFilter } from './core/common/filters/domain-exception.filter';
import { JsonBodyPipe } from './core/utils/parse.util';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  const configService = app.get(ConfigService);
  const validator = app.get(ConfigValidationService);

  validator.validateAppConfig();
  validator.getCloudinaryConfig();

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  app.setGlobalPrefix('api/v1');

  if (configService.get<string>('nodeEnv') === 'production') {
    app.use(helmet());
  }

  app.use(compression());
  app.use(cookieParser());

  app.useGlobalPipes(
    new JsonBodyPipe(),
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        console.log(JSON.stringify(errors, null, 2));
        return new BadRequestException(errors);
      },
    }),
  );

  // Filters (Nest logger is already wired)
  app.useGlobalFilters(
    app.get(HttpExceptionFilter),
    app.get(AppGqlExceptionFilter),
    app.get(DomainExceptionFilter),
  );

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`Server running on port ${port}`);
}

void bootstrap();
