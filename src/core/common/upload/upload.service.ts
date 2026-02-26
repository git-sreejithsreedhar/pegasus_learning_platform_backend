import { Inject, Injectable } from '@nestjs/common';
import { FILE_STORAGE } from './file-storage.token';
import type {
  FileResourceType,
  IFileStorageService,
} from './file-storage.interface';

@Injectable()
export class UploadService {
  constructor(
    @Inject(FILE_STORAGE)
    private readonly storage: IFileStorageService,
  ) {}

  async upload(
    file: Express.Multer.File,
    folder: string,
    resourceType: FileResourceType,
  ) {
    const key = `${Date.now()}-${file.originalname.split('.')[0]}`;

    return this.storage.uploadBuffer(key, file.buffer, {
      contentType: file.mimetype,
      resourceType,
      folder,
    });
  }

  // async delete(publicId: string) {
  //   return this.storage.generateSignedUrl(publicId);
  // }
  async delete(publicId: string, resourceType: FileResourceType) {
    await this.storage.delete(publicId, resourceType);
  }
}
