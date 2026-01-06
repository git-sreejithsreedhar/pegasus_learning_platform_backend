import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import * as usecasesInterface from '../../application/interfaces/usecases.interface';
import type {
  IRequestMentorCorrectionUsecase,
  IRejectMentorUsecase,
  IApproveMentorUsecase,
} from 'src/modules/mentor/domain/interface/usecases.interface';
import {
  FIND_ALL_MENTORS_USECASE,
  GET_MENTOR_DETAILS_USECASE,
} from '../../application/tokens';
import { AdminUserListDto } from '../../application/dtos/admin-user-list.dto';
import { PaginatedResultDto } from 'src/core/common/pagination/pagination.interface';
import { MentorDetailsResponseDto } from '../../application/dtos/get-mentor-details.dto';
import {
  APPROVE_MENTOR_USECASE,
  REJECT_MENTOR_USECASE,
  REQUEST_MENTOR_CORRECTION_USECASE,
} from 'src/modules/mentor/domain/tokens/injection-tokens.constant';

@Controller('admin')
export class AdminController {
  constructor(
    // @Inject(MENTOR_REPOSITORY_TOKEN)
    // private readonly getAllMentor: usecasesInterface.IFindAllMentorsUsecase,
    @Inject(FIND_ALL_MENTORS_USECASE)
    private readonly getAllMentor: usecasesInterface.IFindAllMentorsUsecase,
    @Inject(GET_MENTOR_DETAILS_USECASE)
    private readonly getMentorDetails: usecasesInterface.IGetMentorDetailsUsecase,
    @Inject(REQUEST_MENTOR_CORRECTION_USECASE)
    private readonly requestMentorCorrectionUsecase: IRequestMentorCorrectionUsecase,
    @Inject(REJECT_MENTOR_USECASE)
    private readonly rejectMentorUsecase: IRejectMentorUsecase,
    @Inject(APPROVE_MENTOR_USECASE)
    private readonly approveMentorUsecase: IApproveMentorUsecase,
  ) {}

  // @UseGuards(JwtAuthGuard)
  @Get('mentors')
  async getAllMentors(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: usecasesInterface.AdminUserStatus,
    @Query('sortBy') sortBy?: usecasesInterface.MentorSortBy,
    @Query('sortOrder') sortOrder?: usecasesInterface.SortOrder,
  ): Promise<PaginatedResultDto<AdminUserListDto>> {
    return this.getAllMentor.execute({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      status,
      sortBy,
      sortOrder,
    });
  }

  // get mentor details
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.Admin)
  @Get('mentor/:id')
  async GetMentorDetails(
    @Param('id') mentorId: string,
  ): Promise<MentorDetailsResponseDto> {
    const mentorDetails = await this.getMentorDetails.execute(mentorId);
    return mentorDetails;
  }

  @Patch('mentors/:mentorId/approve')
  async approveMentor(@Param('mentorId') mentorId: string) {
    await this.approveMentorUsecase.execute(mentorId);

    return {
      message: 'Mentor approved successfully',
    };
  }

  @Patch('mentors/:mentorId/reject')
  async rejectMentor(
    @Param('mentorId') mentorId: string,
    @Body('reason') reason: string,
  ) {
    await this.rejectMentorUsecase.execute(mentorId, reason);
    return {
      message: 'Mentor rejected successfully',
    };
  }

  @Patch('mentors/:mentorId/request-correction')
  async requestCorrection(
    @Param('mentorId') mentorId: string,
    @Body('reason') reason: string,
  ) {
    await this.requestMentorCorrectionUsecase.execute(mentorId, reason);
    return {
      message: 'Correction request sent to mentor',
    };
  }
}
