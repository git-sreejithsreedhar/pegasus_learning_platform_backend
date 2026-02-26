// import { BadRequestException } from '@nestjs/common';
// import { Express } from 'express';

// export function validateImage(file: Express.Multer.File) {
//   const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
//   if (!allowed.includes(file.mimetype)) {
//     throw new BadRequestException('Invalid avatar image type');
//   }
// }

// export function validatePdf(file: Express.Multer.File) {
//   if (file.mimetype !== 'application/pdf') {
//     throw new BadRequestException('Only PDF documents are allowed');
//   }
// }

import { BadRequestException } from '@nestjs/common';
import { Express } from 'express';

export function validateImage(file: Express.Multer.File) {
  if (!file.mimetype.startsWith('image/')) {
    throw new BadRequestException('Only image files allowed');
  }
}

export function validateVideo(file: Express.Multer.File) {
  if (!file.mimetype.startsWith('video/')) {
    throw new BadRequestException('Only video files allowed');
  }
}

export function validatePdf(file: Express.Multer.File) {
  if (file.mimetype !== 'application/pdf') {
    throw new BadRequestException('Only PDF files allowed');
  }
}
