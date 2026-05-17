import { BadRequestException } from '@nestjs/common';
import type { Request } from 'express';
import { diskStorageConfig } from 'src/core/common/upload/multer.base';

type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void;

export const mentorDocumentMulterOptions = {
  storage: diskStorageConfig,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB
  },
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
  ) => {
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/gif',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      callback(
        new BadRequestException(`Invalid file type: ${file.mimetype}`),
        false,
      );
      return;
    }

    callback(null, true);
  },
};
