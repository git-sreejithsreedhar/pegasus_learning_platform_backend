// upload/upload.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createCloudinaryStorage } from './clodinary/cloudinary.storage';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: createCloudinaryStorage('images'),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('Only images allowed'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.formatResponse(file);
  }

  @Post('video')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: createCloudinaryStorage('videos'),
      limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
    }),
  )
  uploadVideo(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.formatResponse(file);
  }

  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: createCloudinaryStorage('files'),
      limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.formatResponse(file);
  }
}
