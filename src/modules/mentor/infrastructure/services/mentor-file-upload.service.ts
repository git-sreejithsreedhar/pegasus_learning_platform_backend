import { Inject, Injectable } from '@nestjs/common';
import type { IFileStorageService } from 'src/core/common/upload/file-storage.interface';
import { FILE_STORAGE } from 'src/core/common/upload/file-storage.token';
import {
  validateImage,
  validatePdf,
} from 'src/core/common/upload/validation-helper';

export interface UploadedDocument {
  publicId: string;
  resourceType: 'raw';
  originalName: string;
  uploadedAt: Date;
}

export interface ProcessedMentorDocuments {
  identificationDoc?: UploadedDocument;
  educationalDoc?: UploadedDocument;
  professionalDoc?: UploadedDocument;
  additionalDoc?: UploadedDocument;
  avatarPublicId?: string;
}

@Injectable()
export class MentorFileUploadService {
  constructor(
    @Inject(FILE_STORAGE) private readonly storage: IFileStorageService,
  ) {}

  async process(
    userId: string,
    files: Express.Multer.File[],
  ): Promise<ProcessedMentorDocuments> {
    if (!Array.isArray(files)) {
      return {};
    }

    const fileMap = new Map(files.map((f) => [f.fieldname, f]));

    const avatarPublicId = await this.uploadAvatar(
      userId,
      fileMap.get('avatar'),
    );

    const [identificationDoc, educationalDoc, professionalDoc, additionalDoc] =
      await Promise.all([
        this.uploadPdf(userId, fileMap.get('identificationDoc')),
        this.uploadPdf(userId, fileMap.get('educationalDoc')),
        this.uploadPdf(userId, fileMap.get('professionalDoc')),
        this.uploadPdf(userId, fileMap.get('additionalDoc')),
      ]);

    return {
      avatarPublicId,
      identificationDoc,
      educationalDoc,
      professionalDoc,
      additionalDoc,
    };
  }

  private async uploadAvatar(
    userId: string,
    file?: Express.Multer.File,
  ): Promise<string | undefined> {
    if (!file) return undefined;

    validateImage(file);

    const upload = await this.storage.uploadBuffer(
      `mentors/${userId}/avatar`,
      file.buffer,
      {
        contentType: file.mimetype,
        resourceType: 'image',
      },
    );

    return upload.publicId;
  }

  private async uploadPdf(userId: string, file?: Express.Multer.File) {
    if (!file) return undefined;

    validatePdf(file);

    const upload = await this.storage.uploadBuffer(
      `mentors/${userId}/documents/${this.sanitize(file.originalname)}`,
      file.buffer,
      {
        contentType: file.mimetype,
        resourceType: 'raw',
      },
    );

    return {
      publicId: upload.publicId,
      resourceType: 'raw' as const,
      originalName: file.originalname,
      uploadedAt: new Date(),
    };
  }

  private sanitize(name: string) {
    return name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  }
}
