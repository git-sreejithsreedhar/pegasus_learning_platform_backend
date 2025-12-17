import { BadRequestException } from '@nestjs/common';
import { diskStorageConfig } from 'src/core/common/upload/multer.base';

export const mentorDocumentMulterOptions = {
  storage: diskStorageConfig,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB
  },
  fileFilter: (req, file, callback) => {
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/gif',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(
        new BadRequestException(
          `Invalid file type: ${file.mimetype}`,
        ),
        false,
      );
    }

    callback(null, true);
  },
};
