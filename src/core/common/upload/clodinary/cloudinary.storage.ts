import { CloudinaryStorage } from 'multer-storage-cloudinary';
import type { StorageEngine } from 'multer';
import cloudinary from './cloudinary.config';

export const createCloudinaryStorage = (folder: string): StorageEngine => {
  return new CloudinaryStorage({
    cloudinary,

    // eslint-disable-next-line @typescript-eslint/require-await
    params: async (_req, file) => ({
      folder,
      resource_type: 'auto',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    }),
  }) as unknown as StorageEngine;
};
