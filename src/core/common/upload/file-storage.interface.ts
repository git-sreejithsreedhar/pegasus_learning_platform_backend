export interface UploadResult {
  key: string;
  url?: string;
}

export interface IFileStorageService {
  uploadBuffer(
    key: string,
    file: Buffer,
    options?: { contentType?: string },
  ): Promise<UploadResult>;

  getDownloadUrl(key: string): Promise<string>;

  deleteFile(key: string): Promise<void>;
}
