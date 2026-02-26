import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { CloudMulterOptions } from './multer.memory';
import { validateImage, validatePdf, validateVideo } from './validation-helper';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file', CloudMulterOptions))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    validateImage(file);
    return this.uploadService.upload(file, 'images', 'image');
  }

  @Post('video')
  @UseInterceptors(FileInterceptor('file', CloudMulterOptions))
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    validateVideo(file);
    return this.uploadService.upload(file, 'videos', 'video');
  }

  @Post('file')
  @UseInterceptors(FileInterceptor('file', CloudMulterOptions))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    validatePdf(file);
    return this.uploadService.upload(file, 'files', 'raw');
  }
}
