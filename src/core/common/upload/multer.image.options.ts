// import { BadRequestException } from '@nestjs/common';
// import { diskStorageConfig } from './multer.base';

// export const imageMulterOptions = {
//   storage: diskStorageConfig,
//   limits: {
//     fileSize: 1024 * 1024 * 5, // 5MB
//   },
//   fileFilter: (req, file, callback) => {
//     const allowedImages = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

//     if (!allowedImages.includes(file.mimetype)) {
//       return callback(
//         new BadRequestException('Only image files (jpg, png, gif) are allowed'),
//         false,
//       );
//     }

//     callback(null, true);
//   },
// };
