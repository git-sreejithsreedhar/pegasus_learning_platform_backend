import { Module } from '@nestjs/common';
import { FILE_STORAGE } from './file-storage.token';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadController } from './upload-controller';
import { UploadService } from './upload.service';
import { CloudinaryStorageService } from './cloudinary/cloudinary-storage.service';
import { v2 as cloudinary } from 'cloudinary';

@Module({
  imports: [ConfigModule],
  controllers: [UploadController],
  providers: [
    {
      provide: 'CLOUDINARY',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        cloudinary.config({
          cloud_name: configService.get<string>('app.cloudinary.cloudName'),
          api_key: configService.get<string>('app.cloudinary.apiKey'),
          api_secret: configService.get<string>('app.cloudinary.apiSecret'),
          secure: true,
        });
        return cloudinary;
      },
    },
    UploadService,
    {
      provide: FILE_STORAGE,
      useClass: CloudinaryStorageService,
    },
  ],
  exports: [FILE_STORAGE],
})
export class FileStorageModule {}
