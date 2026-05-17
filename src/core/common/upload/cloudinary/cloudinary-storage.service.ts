import { Inject, Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { v2 as Cloudinary, UploadApiResponse } from 'cloudinary';
import {
  FileResourceType,
  IFileStorageService,
  UploadResult,
} from '../file-storage.interface';

@Injectable()
export class CloudinaryStorageService implements IFileStorageService {
  constructor(
    @Inject('CLOUDINARY')
    private readonly cloudinary: typeof Cloudinary,
  ) {}

  async uploadBuffer(
    key: string,
    buffer: Buffer,
    options?: {
      contentType?: string;
      resourceType?: FileResourceType;
      folder?: string;
    },
  ): Promise<UploadResult> {
    const resourceType = options?.resourceType ?? 'raw';

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        {
          folder: options?.folder,
          resource_type: resourceType,
          public_id: key,
        },
        (error, result) => {
          if (error) {
            const normalizedError =
              error instanceof Error ? error : new Error(JSON.stringify(error));

            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            reject(normalizedError);
            return;
          }

          if (!result) {
            reject(new Error('Cloudinary returned no result'));
            return;
          }

          resolve(result);
        },
      );

      stream.on('error', (err) => {
        reject(err instanceof Error ? err : new Error(String(err)));
      });

      Readable.from(buffer).pipe(stream);
    });

    return {
      key,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
    };
  }

  generatePublicUrl(publicId: string, resourceType: FileResourceType = 'raw') {
    return this.cloudinary.url(publicId, {
      resource_type: resourceType,
      secure: true,
    });
  }

  generateSignedUrl(
    publicId: string,
    resourceType: FileResourceType = 'raw',
    expiresInSeconds = 600,
  ) {
    const type = 'upload';

    return this.cloudinary.utils.private_download_url(publicId, '', {
      resource_type: resourceType,
      type,
      expires_at: Math.floor(Date.now() / 1000) + expiresInSeconds,
    });
  }

  generateApiSignature(
    publicId: string,
    resourceType: FileResourceType,
    format: string,
  ) {
    const timestamp = Math.floor(Date.now() / 1000);

    const signature = this.cloudinary.utils.api_sign_request(
      {
        public_id: publicId,
        resource_type: resourceType,
        format,
        timestamp,
      },
      this.cloudinary.config().api_secret as string,
    );

    return {
      signature,
      timestamp,
    };
  }

  async delete(
    publicId: string,
    resourceType: FileResourceType = 'raw',
  ): Promise<void> {
    await this.cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  }
}
