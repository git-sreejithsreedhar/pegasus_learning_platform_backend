import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export const winstonConfig: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(
          ({
            level,
            message,
            timestamp,
          }: {
            level: string;
            message: string;
            timestamp?: string;
          }) => {
            return `[${timestamp ?? 'N/A'}] ${level}: ${message}`;
          },
        ),
      ),
    }),

    new winston.transports.File({
      filename: 'logs/app.log',
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),

    new DailyRotateFile({
      filename: 'logs/%DATE%-combined.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
};
