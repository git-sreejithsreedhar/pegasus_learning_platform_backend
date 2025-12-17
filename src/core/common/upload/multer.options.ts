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
