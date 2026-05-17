import {
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
// import { plainToInstance } from 'class-transformer';
// import { validate } from 'class-validator';
import type { Request } from 'express';

import { MentorRegisterDto } from './dto/create-mentor.dto';

import { CREATE_MENTOR_USECASE } from '../domain/tokens/injection-tokens.constant';
import type { ICreateMentorUsecase } from '../application/IUseCase/usecases.interface';

import { JwtAuthGuard } from 'src/core/common/guards/jwt-Auth.guard';

import { CloudMulterOptions } from 'src/core/common/upload/multer.memory';
import { MentorRegisterPipe } from '../infrastructure/pipes/mentor-register/mentor-register.pipe';
import { MentorFileUploadService } from '../infrastructure/services/mentor-file-upload.service';

@Controller('mentor')
export class MentorController {
  constructor(
    @Inject(CREATE_MENTOR_USECASE)
    private readonly createMentorUsecase: ICreateMentorUsecase,

    private readonly mentorFileUploadService: MentorFileUploadService,
  ) {}

  @Post('register')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor(CloudMulterOptions))
  async registerMentor(
    @Req() req: Request,
    @Body(new MentorRegisterPipe()) dto: MentorRegisterDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log(dto);
    // ---------------- Auth ----------------
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user.userId;

    const eligibility = await this.createMentorUsecase.checkEligibility(userId);
    if (!eligibility.allowed) {
      return eligibility;
    }

    const safeFiles = Array.isArray(files) ? files : [];

    try {
      // Delegate file handling to service
      const uploadedDocs = await this.mentorFileUploadService.process(
        userId,
        safeFiles,
      );

      if (uploadedDocs.avatarPublicId) {
        dto.profile.avatar = uploadedDocs.avatarPublicId;
      }

      dto.documents = {
        identificationDoc: uploadedDocs.identificationDoc,
        educationalDoc: uploadedDocs.educationalDoc,
        professionalDoc: uploadedDocs.professionalDoc,
        additionalDoc: uploadedDocs.additionalDoc,
      };

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
