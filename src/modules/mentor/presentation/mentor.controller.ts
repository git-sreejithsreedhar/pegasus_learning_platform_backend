import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { MentorRegisterDto } from '../application/dtos/mentor-register.dto';

@Controller('mentor')
export class MentorController {
  constructor() {}

  @Post('register')
  @UseInterceptors(AnyFilesInterceptor())
  async registerMentor(
    @Body() body: MentorRegisterDto,
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
  ) {
    console.log('Received register request:', body);
    console.log('Files:', files);
    // return await this.registerMentor.execute(body, files)
  }
}
