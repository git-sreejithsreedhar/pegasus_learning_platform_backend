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
import express from 'express';
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { MentorRegisterDto } from './dto/create-mentor.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate, validate as validateClass } from 'class-validator';
import * as usecasesInterface from '../domain/interface/usecases.interface';
import { CREATE_MENTOR_USECASE } from '../domain/tokens/injection-tokens.constant';
import { JwtAuthGuard } from 'src/core/common/guards/jwt-Auth.guard';
import { Request } from 'express';
import * as fileStorageInterface from 'src/core/common/upload/file-storage.interface';
import { FILE_STORAGE } from 'src/core/common/upload/file-storage.token';
// import { mentorDocumentMulterOptions } from './multer.mentor-doc.options';
import {
  validateImage,
  validatePdf,
} from 'src/core/common/upload/validation-helper';
import { MulterOptions } from 'src/core/common/upload/multer.options';
// import { multerOptions } from 'src/core/common/upload/multer.options';

@Controller('mentor')
export class MentorController {
  constructor(
    @Inject(FILE_STORAGE)
    private readonly storage: fileStorageInterface.IFileStorage,
    private readonly jwtAuthGuard: JwtAuthGuard,
    @Inject(CREATE_MENTOR_USECASE)
    private readonly createMentorUsecase: usecasesInterface.ICreateMentorUsecase,
  ) {}

  //   @Post('register')
  //   @UseGuards(JwtAuthGuard)
  //   @UseInterceptors(AnyFilesInterceptor())
  //   async registerMentor(
  //     @Req() req: express.Request,
  //     // @Body() body: MentorRegisterDto,
  //     @Body() body: any,
  //     @UploadedFiles() files: Express.Multer.File[],
  //   ) {

  //     const user = req.user;
  //     // console.log(user);
  //     if (!user) {
  //       throw new Error('User not authenticated');
  //     }
  //     const userId = user.userId;
  //     // console.log('Raw body received:', body);

  //     if (!userId) {
  //       throw new Error('User ID not found');
  //     }

  //     // Manually parse the JSON strings
  //     try {
  //       if (typeof body.profile === 'string') {
  //         body.profile = JSON.parse(body.profile);
  //       }
  //       if (typeof body.socialLinks === 'string') {
  //         body.socialLinks = JSON.parse(body.socialLinks);
  //       }
  //       if (typeof body.expertise === 'string') {
  //         body.expertise = JSON.parse(body.expertise);
  //       }
  //       if (typeof body.customSkills === 'string') {
  //         body.customSkills = JSON.parse(body.customSkills);
  //       }

  //       // Convert numeric strings to numbers
  //       if (body.skillProficiency) {
  //         body.skillProficiency = parseInt(body.skillProficiency, 10);
  //       }
  //       if (body.yearsExperience) {
  //         body.yearsExperience = parseInt(body.yearsExperience, 10);
  //       }
  //       if (body.hourlyRate) {
  //         body.hourlyRate = parseFloat(body.hourlyRate);
  //       }

  //       // console.log('Parsed body:', body);
  //     } catch (error) {
  //       console.error('Error parsing body:', error);
  //       throw new BadRequestException('Invalid JSON in form data');
  //     }

  //     // Validate the parsed body using class-validator manually
  //     const dto = plainToClass(MentorRegisterDto, body);
  //     const errors = await validateClass(dto);

  //     if (errors.length > 0) {
  //       console.error('Validation errors:', errors);
  //       throw new BadRequestException(errors);
  //     }

  //     // Process documents
  //     // const documents = {
  //     //   identificationDoc: files.find((f) => f.fieldname === 'identificationDoc')
  //     //     ?.path,
  //     //   educationalDoc: files.find((f) => f.fieldname === 'educationalDoc')?.path,
  //     //   professionalDoc: files.find((f) => f.fieldname === 'professionalDoc')
  //     //     ?.path,
  //     //   additionalDoc: files.find((f) => f.fieldname === 'additionalDoc')?.path,
  //     // };
  //     const documents = {
  //       identificationDoc: files.identificatinDoc ?  ? await this.storage.save(files.identificationDoc[0]) : null,
  //       educationalDoc: files.educationalDoc ? await this.storage.save(files.educationDoc[0]) : null,
  //       professionalDoc: files.professionalDoc ? await this.storage.save(files.professionalDoc[0]) : null,
  //       additionalDoc: files.additionalDoc ? await this.storage.save(files.additionalDoc[0])  : null;
  //     }

  //     body.documents = documents;

  //     const mentor = await this.createMentorUsecase.execute(userId, body, files);
  //     return { success: true, mentor };
  //   }
  // }
  @Post('register')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor(MulterOptions))
  async registerMentor(
    @Req() req: Express.Request,
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const user = req.user as any;
    if (!user?.userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const userId = user.userId;

    /* ---------------- Parse JSON fields ---------------- */
    try {
      ['profile', 'socialLinks', 'expertise', 'customSkills'].forEach((key) => {
        if (typeof body[key] === 'string') {
          body[key] = JSON.parse(body[key]);
        }
      });

      body.skillProficiency = Number(body.skillProficiency);
      body.yearsExperience = Number(body.yearsExperience);
      body.hourlyRate = Number(body.hourlyRate);
    } catch {
      throw new BadRequestException('Invalid JSON in form data');
    }

    /* ---------------- Validate DTO ---------------- */
    const dto = plainToInstance(MentorRegisterDto, body);
    const errors = await validate(dto);
    if (errors.length) throw new BadRequestException(errors);

    /* ---------------- Handle Avatar ---------------- */
    const avatarFile = files.find((f) => f.fieldname === 'avatar');
    if (avatarFile) {
      validateImage(avatarFile);
      body.profile.avatar = await this.storage.save(avatarFile);
    }

    /* ---------------- Handle Documents ---------------- */
    const getPdfPath = async (field: string) => {
      const file = files.find((f) => f.fieldname === field);
      if (!file) return null;
      validatePdf(file);
      return this.storage.save(file);
    };

    body.documents = {
      identificationDoc: await getPdfPath('identificationDoc'),
      educationalDoc: await getPdfPath('educationalDoc'),
      professionalDoc: await getPdfPath('professionalDoc'),
      additionalDoc: await getPdfPath('additionalDoc'),
    };

    /* ---------------- Create mentor ---------------- */
    await this.createMentorUsecase.execute(userId, body);

    return { success: true };
  }
}

//   // const userId = req.user?.id || '69386428251bcdd06707b694';
//   // if (!userId) {
//   //   throw new Error('User not authenticated');
//   // }
// const userId = '69386428251bcdd06707b694';
// console.log('Received register request:', body);
// console.log('Files:', files);
// const documents = {
//   identificationDoc: files.find((f) => f.fieldname === 'identificationDoc')
//     ?.path,
//   educationalDoc: files.find((f) => f.fieldname === 'educationalDoc')?.path,
//   professionalDoc: files.find((f) => f.fieldname === 'professionalDoc')
//     ?.path,
//   additionalDoc: files.find((f) => f.fieldname === 'additionalDoc')?.path,
// };
// body.documents = documents;
// // const mentor = await this.createMentorUsecase.execute(userId, body, files);
// const mentor = await this.createMentorUsecase.execute(
//   userId,
//   { ...body, documents },
//   files,
// );
// return { success: true, mentor };
