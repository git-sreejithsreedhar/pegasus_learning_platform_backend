import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
  Req,
  UnauthorizedException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { Request } from 'express';

import {
  MentorRegisterDto,
  ProfileDto,
  SocialLinksDto,
} from './dto/create-mentor.dto';

import { CREATE_MENTOR_USECASE } from '../domain/tokens/injection-tokens.constant';
import type { ICreateMentorUsecase } from '../application/IUseCase/usecases.interface';

import { JwtAuthGuard } from 'src/core/common/guards/jwt-Auth.guard';
import { FILE_STORAGE } from 'src/core/common/upload/file-storage.token';
import type { IFileStorageService } from 'src/core/common/upload/file-storage.interface';

import {
  validateImage,
  validatePdf,
} from 'src/core/common/upload/validation-helper';
import { safeJsonParse } from 'src/core/utils/json.util';
import { CloudMulterOptions } from 'src/core/common/upload/multer.memory';

interface MentorRegisterBody {
  phone?: string;
  about?: string;
  primarySkill?: string;
  communicationPref?: string;
  skillProficiency?: string | number;
  yearsExperience?: string | number;
  hourlyRate?: string | number;
  expertise?: unknown;
  profile?: unknown;
  socialLinks?: unknown;
}

@Controller('mentor')
export class MentorController {
  constructor(
    @Inject(FILE_STORAGE)
    private readonly storage: IFileStorageService,

    @Inject(CREATE_MENTOR_USECASE)
    private readonly createMentorUsecase: ICreateMentorUsecase,
  ) {}

  @Post('register')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor(CloudMulterOptions))
  async registerMentor(
    @Req() req: Request,
    @Body() body: MentorRegisterBody,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // ---------------- Auth ----------------
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user.userId;

    // console.log('AUTHORIZED, USERID :', userId);
    // console.log('BODY :', body);

    // ---------------- Parse body ----------------
    const parsedBody: Partial<MentorRegisterDto> = {
      phone: body.phone,
      about: body.about,
      primarySkill: body.primarySkill,
      communicationPref: body.communicationPref,

      skillProficiency:
        body.skillProficiency === undefined
          ? undefined
          : Number(body.skillProficiency),
      yearsExperience:
        body.yearsExperience === undefined
          ? undefined
          : Number(body.yearsExperience),
      hourlyRate:
        body.hourlyRate === undefined ? undefined : Number(body.hourlyRate),

      expertise: safeJsonParse<string[]>(body.expertise, []),
      profile: safeJsonParse<ProfileDto>(body.profile, { bio: '' }),
      socialLinks: safeJsonParse<SocialLinksDto>(body.socialLinks, {}),
    };

    const dto = plainToInstance(MentorRegisterDto, parsedBody, {
      enableImplicitConversion: true,
    });

    const errors = await validate(dto);
    if (errors.length) {
      throw new BadRequestException(errors);
    }

    const safeFiles = Array.isArray(files) ? files : [];

    try {
      // ---------------- Avatar upload ----------------
      const avatarFile = safeFiles.find((f) => f.fieldname === 'avatar');
      if (avatarFile) {
        validateImage(avatarFile);

        const upload = await this.storage.uploadBuffer(
          `mentors/${userId}/avatar`,
          avatarFile.buffer,
          { contentType: avatarFile.mimetype, resourceType: 'image' },
        );

        dto.profile.avatar = upload.publicId;
      }

      // ---------------- Document uploads ----------------
      // const getPdfUrl = async (
      //   field:
      //     | 'identificationDoc'
      //     | 'educationalDoc'
      //     | 'professionalDoc'
      //     | 'additionalDoc',
      // ): Promise<string | undefined> => {
      //   const file = safeFiles.find((f) => f.fieldname === field);
      //   if (!file) return undefined;

      //   validatePdf(file);

      //   const upload = await this.storage.uploadBuffer(
      //     `mentors/${userId}/documents/${file.originalname}`,
      //     file.buffer,
      //     { contentType: file.mimetype, resourceType: 'raw' },
      //   );

      //   return {
      //     publicId: upload.publicId,
      //     resourceType: 'raw',
      //     originalName: file.originalname,
      //     updatedAt: new Date(),
      //   };
      // };

      const getPdfData = async (
        field:
          | 'identificationDoc'
          | 'educationalDoc'
          | 'professionalDoc'
          | 'additionalDoc',
      ) => {
        const file = safeFiles.find((f) => f.fieldname === field);
        if (!file) return undefined;

        validatePdf(file);

        const upload = await this.storage.uploadBuffer(
          `mentors/${userId}/documents/${file.originalname}`,
          file.buffer,
          {
            contentType: file.mimetype,
            resourceType: 'raw', // ✅ IMPORTANT
          },
        );

        return {
          publicId: upload.publicId,
          resourceType: 'raw' as const,
          originalName: file.originalname,
          uploadedAt: new Date(),
        };
      };

      const [
        identificationDoc,
        educationalDoc,
        professionalDoc,
        additionalDoc,
      ] = await Promise.all([
        getPdfData('identificationDoc'),
        getPdfData('educationalDoc'),
        getPdfData('professionalDoc'),
        getPdfData('additionalDoc'),
      ]);

      dto.documents = {
        identificationDoc,
        educationalDoc,
        professionalDoc,
        additionalDoc,
      };
      console.log('Crete Mntor usecase called');
      // ---------------- Create mentor ----------------
      const result = await this.createMentorUsecase.execute(userId, dto);

      if (result.type === 'STATUS') {
        return result;
      }

      return result;
    } catch (error) {
      console.error('ERROR: ', error);
      throw error;
    }
  }
}
