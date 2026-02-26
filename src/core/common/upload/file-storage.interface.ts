export type FileResourceType = 'image' | 'video' | 'raw';

// export interface UploadResult {
//   key: string;
//   url: string;
//   publicId: string;
// }
export interface UploadResult {
  key: string;
  url: string;
  publicId: string;
  format: string;
}

export interface IFileStorageService {
  uploadBuffer(
    key: string,
    buffer: Buffer,
    options?: {
      contentType?: string;
      resourceType?: FileResourceType;
      folder?: string;
    },
  ): Promise<UploadResult>;

  generatePublicUrl(publicId: string, resourceType?: FileResourceType): string;

  generateSignedUrl(
    publicId: string,
    resourceType?: FileResourceType,
    expiresInSeconds?: number,
  ): string;

  delete(publicId: string, resourceType?: FileResourceType): Promise<void>;
}
