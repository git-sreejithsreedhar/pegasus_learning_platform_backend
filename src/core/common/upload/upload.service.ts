import { Injectable } from '@nestjs/common';
import { IFileStorage } from './file-storage.interface';

@Injectable()
export class LocalFileStorageService implements IFileStorage {
  async save(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new Error('File not found');
    }
    return `uploads/${file.filename}`;
  }
}
