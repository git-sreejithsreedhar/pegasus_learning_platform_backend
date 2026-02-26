declare module 'multer-storage-cloudinary' {
  import type { StorageEngine } from 'multer';

  export class CloudinaryStorage implements StorageEngine {
    constructor(options: unknown);
  }
}
