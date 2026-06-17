// import { diskStorage } from 'multer';

// export const multerOptions = {
//   storage: diskStorage({
//     destination: './uploads',
//     filename: (req, file, callback) => {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//       const originalName = file.originalname.replace(/\s+/g, '-');
//       callback(null, `${uniqueSuffix}-${originalName}`);
//     },
//   }),
//   limits: {
//     fileSize: 1024 * 1024 * 5,
//   },
//   fileFilter: (req, file, callback) => {
//     if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
//       return callback(new Error('Only image files allowed'), false);
//     }
//     callback(null, true);
import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import type { Request } from 'express';

type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void;

export const MulterOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (_req: Request, file: Express.Multer.File, cb) => {
      const ext = file.originalname.split('.').pop();
      const name = file.originalname
        .replace(/\.[^/.]+$/, '')
        .replace(/\s+/g, '-');

      cb(null, `${Date.now()}-${name}.${ext}`);
    },
  }),

  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },

  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    const imageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const pdfTypes = ['application/pdf'];

    if (
      (file.fieldname === 'avatar' && imageTypes.includes(file.mimetype)) ||
      (file.fieldname !== 'avatar' && pdfTypes.includes(file.mimetype))
    ) {
      cb(null, true);
      return;
    }

    cb(
      new BadRequestException(
        file.fieldname === 'avatar'
          ? 'Avatar must be an image'
          : 'Documents must be PDF',
      ),
      false,
    );
  },
};
