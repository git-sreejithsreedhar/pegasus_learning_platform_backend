import { Module } from '@nestjs/common';
import { LocalFileStorageService } from './upload.service';
import { FILE_STORAGE } from './file-storage.token';

@Module({
  providers: [
    {
      provide: FILE_STORAGE,
      useClass: LocalFileStorageService,
    },
  ],
  exports: [FILE_STORAGE],
})
export class FileStorageModule {}
