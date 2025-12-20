import {
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
// import { LocalFileStorageService } from './upload.service';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { multerOptions } from './multer.options';
import { FileInterceptor } from '@nestjs/platform-express';
import { LocalFileStorageService } from './upload.service';
import { MulterOptions } from './multer.options';

@Controller('upload')
export class UploadController {
  constructor(private readonly storage: LocalFileStorageService) {}

  @Post('document')
  // @UseInterceptors(FileInterceptor('file', multerOptions))
  @UseInterceptors(FileInterceptor('file', MulterOptions))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const filePath = await this.storage.save(file);
    return { filePath };
  }
}

// import { imageMulterOptions } from './multer.image.options';
// import * as fileStorageInterface from './file-storage.interface';
// import { FILE_STORAGE } from './file-storage.token';
// // import { documentMulterOptions } from './multer.document.option';

// @Controller('upload')
// export class UploadController {
//   constructor(
//     @Inject(FILE_STORAGE)
//     private readonly storage: fileStorageInterface.IFileStorage,
//   ) {}

//   //image upload
//   @Post('image')
//   @UseInterceptors(FileInterceptor('file', imageMulterOptions))
//   async uploadImage(@UploadedFile() file: Express.Multer.File) {
//     const filePath = await this.storage.save(file);
//     return {
//       success: true,
//       type: 'image',
//       filePath,
//     };
//   }

//   // Document upload
//   @Post('document')
//   @UseInterceptors(FileInterceptor('file', documentMulterOptions))
//   async uploadDocument(@UploadedFile() file: Express.Multer.File) {
//     const filePath = await this.storage.save(file);
//     return {
//       success: true,
//       type: 'document',
//       filePath,
//     };
//   }
// }
