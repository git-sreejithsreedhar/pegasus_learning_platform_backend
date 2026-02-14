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

import { CloudMulterOptions } from 'src/core/common/upload/multer/multer-cloudinary.options';
import {
  validateImage,
  validatePdf,
} from 'src/core/common/upload/validation-helper';
import { safeJsonParse } from 'src/core/utils/json.util';

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
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log('REGISTER HIT');

    // ---------------- Auth ----------------
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user.userId;

    // ---------------- Parse body ----------------
    const parsedBody: Partial<MentorRegisterDto> = {
      phone: body.phone,
      about: body.about,
      primarySkill: body.primarySkill,
      communicationPref: body.communicationPref,

      skillProficiency: Number(body.skillProficiency),
      yearsExperience: Number(body.yearsExperience),
      hourlyRate: Number(body.hourlyRate),

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

    const safeFiles = Array.isArray(files) ? files: [];

    console.log(safeFiles);

    // ---------------- Avatar upload ----------------
    const avatarFile = files.find((f) => f.fieldname === 'avatar');
    if (avatarFile) {
      validateImage(avatarFile);

      const upload = await this.storage.uploadBuffer(
        `mentors/${userId}/avatar`,
        avatarFile.buffer,
        { contentType: avatarFile.mimetype },
      );

      dto.profile.avatar = upload.url;
    }

    console.log('ABOUT TO UPLOAD FILE');

    // ---------------- Document uploads ----------------
    const getPdfUrl = async (
      field:
        | 'identificationDoc'
        | 'educationalDoc'
        | 'professionalDoc'
        | 'additionalDoc',
    ): Promise<string | undefined> => {
      const file = files.find((f) => f.fieldname === field);
      if (!file) return undefined;

      validatePdf(file);

      const upload = await this.storage.uploadBuffer(
        `mentors/${userId}/documents/${file.originalname}`,
        file.buffer,
        { contentType: file.mimetype },
      );

      return upload.url;
    };

    dto.documents = {
      identificationDoc: await getPdfUrl('identificationDoc'),
      educationalDoc: await getPdfUrl('educationalDoc'),
      professionalDoc: await getPdfUrl('professionalDoc'),
      additionalDoc: await getPdfUrl('additionalDoc'),
    };

    console.log('UPLOAD DONE');

    // ---------------- Create mentor ----------------
    const result = await this.createMentorUsecase.execute(userId, dto);

    if (result.type === 'STATUS') {
      return result;
    }

    return result;
  }
}
