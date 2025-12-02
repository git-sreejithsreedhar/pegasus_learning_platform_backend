import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { LocalFileStorageService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer.options';

@Controller('upload')
export class UploadController {
  constructor(private readonly storage: LocalFileStorageService) {}

  @Post('document')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const filePath = await this.storage.save(file);
    return { filePath };
  }
}
