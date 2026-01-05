import { BadRequestException } from '@nestjs/common';
import { Express } from 'express';

export function validateImage(file: Express.Multer.File) {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
  if (!allowed.includes(file.mimetype)) {
    throw new BadRequestException('Invalid avatar image type');
  }
}

export function validatePdf(file: Express.Multer.File) {
  if (file.mimetype !== 'application/pdf') {
    throw new BadRequestException('Only PDF documents are allowed');
  }
}
