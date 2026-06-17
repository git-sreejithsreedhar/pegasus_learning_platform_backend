// import { BadRequestException } from '@nestjs/common';
// import { diskStorageConfig } from './multer.base';

// export const documentMulterOptions = {
//   storage: diskStorageConfig,
//   limits: {
//     fileSize: 1024 * 1024 * 10, // 10MB
//   },
//   fileFilter: (req, file, callback) => {
//     const allowedDocs = ['application/pdf'];

//     if (!allowedDocs.includes(file.mimetype)) {
//       return callback(
//         new BadRequestException('Only PDF documents are allowed'),
//         false,
//       );
//     }

//     callback(null, true);
//   },
// };
