// upload/upload.service.ts
import { Injectable } from '@nestjs/common';
import cloudinary from './clodinary/cloudinary.config';

@Injectable()
export class UploadService {
  formatResponse(file: Express.Multer.File) {
    return {
      url: file.path,
      publicId: file.filename,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async delete(publicId: string) {
    return cloudinary.uploader.destroy(publicId, {
      resource_type: 'auto',
    });
  }
}
