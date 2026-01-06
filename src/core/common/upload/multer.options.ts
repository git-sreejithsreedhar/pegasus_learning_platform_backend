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

export const MulterOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
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

  fileFilter: (req, file, cb) => {
    const imageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const pdfTypes = ['application/pdf'];

    if (
      (file.fieldname === 'avatar' && imageTypes.includes(file.mimetype)) ||
      (file.fieldname !== 'avatar' && pdfTypes.includes(file.mimetype))
    ) {
      return cb(null, true);
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
