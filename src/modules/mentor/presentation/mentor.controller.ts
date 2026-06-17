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
  // UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { MentorRegisterDto } from './dto/create-mentor.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import * as usecasesInterface from '../domain/interface/usecases.interface';
import { CREATE_MENTOR_USECASE } from '../domain/tokens/injection-tokens.constant';
import { JwtAuthGuard } from 'src/core/common/guards/jwt-Auth.guard';
import type { Request } from 'express';
import * as fileStorageInterface from 'src/core/common/upload/file-storage.interface';
import { FILE_STORAGE } from 'src/core/common/upload/file-storage.token';
import { MulterOptions } from 'src/core/common/upload/multer.options';
import {
  validateImage,
  validatePdf,
} from 'src/core/common/upload/validation-helper';
import { safeJsonParse } from 'src/core/utils/json.util';

interface MentorRegisterMultipartBody {
  phone: string;
  about: string;
  primarySkill: string;
  communicationPref: string;

  expertise?: string; // JSON string
  customSkills?: string; // if still sent by FE, otherwise remove
  profile?: string; // JSON string
  socialLinks?: string; // JSON string

  skillProficiency?: string;
  yearsExperience?: string;
  hourlyRate?: string;
}

// interface AuthenticatedRequest extends Request {
//   user: {
//     userId: string;
//   };
// }

@Controller('mentor')
export class MentorController {
  constructor(
    @Inject(FILE_STORAGE)
    private readonly storage: fileStorageInterface.IFileStorage,
    private readonly jwtAuthGuard: JwtAuthGuard,
    @Inject(CREATE_MENTOR_USECASE)
    private readonly createMentorUsecase: usecasesInterface.ICreateMentorUsecase,
  ) {}

  // @Post('register')
  // @UseGuards(JwtAuthGuard)
  // @UseInterceptors(AnyFilesInterceptor(MulterOptions))
  // async registerMentor(
  //   @Req() req: Express.Request,
  //   @Body() body: any,
  //   @UploadedFiles() files: Express.Multer.File[],
  // ) {
  //   const user = req.user as any;
  //   // console.log(user)
  //   if (!user?.userId) {
  //     throw new UnauthorizedException('User not authenticated');
  //   }

  //   const userId = user.userId;

  //   /* ---------------- Parse JSON fields ---------------- */
  //   try {
  //     ['profile', 'socialLinks', 'expertise', 'customSkills'].forEach((key) => {
  //       if (typeof body[key] === 'string') {
  //         body[key] = JSON.parse(body[key]);
  //       }
  //     });

  //     body.skillProficiency = Number(body.skillProficiency);
  //     body.yearsExperience = Number(body.yearsExperience);
  //     body.hourlyRate = Number(body.hourlyRate);
  //   } catch {
  //     throw new BadRequestException('Invalid JSON in form data');
  //   }

  //   /* ---------------- Validate DTO ---------------- */
  //   const dto = plainToInstance(MentorRegisterDto, body);
  //   const errors = await validate(dto);
  //   if (errors.length) throw new BadRequestException(errors);

  //   /* ---------------- Handle Avatar ---------------- */
  //   const avatarFile = files.find((f) => f.fieldname === 'avatar');
  //   if (avatarFile) {
  //     validateImage(avatarFile);
  //     body.profile.avatar = await this.storage.save(avatarFile);
  //   }

  //   /* ---------------- Handle Documents ---------------- */
  //   const getPdfPath = async (field: string) => {
  //     const file = files.find((f) => f.fieldname === field);
  //     if (!file) return null;
  //     validatePdf(file);
  //     return this.storage.save(file);
  //   };

  //   body.documents = {
  //     identificationDoc: await getPdfPath('identificationDoc'),
  //     educationalDoc: await getPdfPath('educationalDoc'),
  //     professionalDoc: await getPdfPath('professionalDoc'),
  //     additionalDoc: await getPdfPath('additionalDoc'),
  //   };

  //   /* ---------------- Create mentor ---------------- */
  //   await this.createMentorUsecase.execute(userId, body);

  //   return { success: true };
  // }
  // }

  @Post('register')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor(MulterOptions))
  async registerMentor(
    @Req() req: Request,
    @Body() body: MentorRegisterMultipartBody,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const userId = req.user.userId;

    /* ---------------- Parse JSON fields ---------------- */
    const parsedBody: Partial<MentorRegisterDto> = {};

    try {
      parsedBody.profile = safeJsonParse(body.profile, { bio: '' });
      parsedBody.socialLinks = safeJsonParse(body.socialLinks, {});
      parsedBody.expertise = safeJsonParse(body.expertise, []);

      parsedBody.phone = body.phone;
      parsedBody.about = body.about;
      parsedBody.primarySkill = body.primarySkill;
      parsedBody.communicationPref = body.communicationPref;
      parsedBody.skillProficiency = body.skillProficiency
        ? Number(body.skillProficiency)
        : 1;

      parsedBody.yearsExperience = body.yearsExperience
        ? Number(body.yearsExperience)
        : 0;

      parsedBody.hourlyRate = body.hourlyRate ? Number(body.hourlyRate) : 0;
    } catch {
      throw new BadRequestException('Invalid JSON in form data');
    }

    /* ---------------- Validate DTO ---------------- */
    const dto = plainToInstance(MentorRegisterDto, parsedBody, {
      enableImplicitConversion: true,
    });

    const errors = await validate(dto);
    if (errors.length) {
      throw new BadRequestException(errors);
    }

    /* ---------------- Handle Avatar ---------------- */
    const avatarFile = files.find((f) => f.fieldname === 'avatar');
    if (avatarFile) {
      validateImage(avatarFile);
      dto.profile.avatar = await this.storage.save(avatarFile);
    }

    /* ---------------- Handle Documents ---------------- */
    const getPdfPath = async (
      field:
        | 'identificationDoc'
        | 'educationalDoc'
        | 'professionalDoc'
        | 'additionalDoc',
    ): Promise<string | undefined> => {
      const file = files.find((f) => f.fieldname === field);
      if (!file) return undefined;
      validatePdf(file);
      return this.storage.save(file);
    };

    dto.documents = {
      identificationDoc: await getPdfPath('identificationDoc'),
      educationalDoc: await getPdfPath('educationalDoc'),
      professionalDoc: await getPdfPath('professionalDoc'),
      additionalDoc: await getPdfPath('additionalDoc'),
    };

    /* ---------------- Create mentor ---------------- */
    await this.createMentorUsecase.execute(userId, dto);

    return { success: true };
  }
}
