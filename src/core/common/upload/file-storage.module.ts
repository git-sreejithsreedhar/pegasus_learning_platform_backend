import { Module } from '@nestjs/common';
import { FILE_STORAGE } from './file-storage.token';
import { ConfigModule } from '@nestjs/config';
import { UploadController } from './upload-controller';
import { UploadService } from './upload.service';

@Module({
  imports: [ConfigModule],
  controllers: [UploadController],
  providers: [
    {
      provide: FILE_STORAGE,
      useClass: UploadService,
    },
  ],
  exports: [FILE_STORAGE],
})
export class FileStorageModule {}
