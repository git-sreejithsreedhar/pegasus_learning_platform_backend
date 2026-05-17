import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { Mentor } from '../../domain/entities/mentor.entity';
import { MentorDocument, MentorModel } from './models/mentor.schema';
import {
  PagePaginationQuery,
  PaginatedResultDto,
} from 'src/core/common/pagination/pagination.interface';
import { mongoPagePaginate } from 'src/core/common/pagination/mongo-pagination.util';
import { IMentorRepository } from '../../domain/interface/mentor.repository.interface';
import { AdminUserListDto } from 'src/modules/admin/application/dtos/admin-user-list.dto';
import { MentorMapper } from '../mappers/mentor.mapper';

interface AdminMentorAggregationResult {
  data: AdminUserListDto[];
  meta: { total: number }[];
}

@Injectable()
export class MentorRepository implements IMentorRepository {
  constructor(
    @InjectModel(MentorModel.name)
    private readonly mentorModel: Model<MentorDocument>,
  ) {}

  async findWithPagination(query: PagePaginationQuery) {
    return mongoPagePaginate<MentorDocument>(
      this.mentorModel,
      {},
      query.page ?? 1,
      query.limit ?? 10,
    );
  }

  // create mentor
  async create(mentor: Mentor): Promise<Mentor> {
    const persistenceData = MentorMapper.toPersistence(mentor);

    const doc = new this.mentorModel(persistenceData);
    const saved = await doc.save();

    return MentorMapper.toDomain(saved);
  }

  // update mentor
  async update(mentor: Mentor): Promise<Mentor> {
    if (!mentor._id) {
      throw new NotFoundException('Mentor ID not found');
    }

    const persistenceData = MentorMapper.toPersistence(mentor);

    const updated = await this.mentorModel
      .findByIdAndUpdate(mentor._id, persistenceData, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('Mentor not found');
    }

    return MentorMapper.toDomain(updated);
  }

  // find by ID
  async findByUserId(userId: string): Promise<Mentor | null> {
    const doc = await this.mentorModel.findOne({ userId }).exec();
    return doc ? MentorMapper.toDomain(doc) : null;
  }

  async findById(id: string): Promise<Mentor | null> {
    const doc = await this.mentorModel.findById(id).exec();
    return doc ? MentorMapper.toDomain(doc) : null;
  }

  async approveMentor(id: string): Promise<Mentor> {
    const updated = await this.mentorModel
      .findByIdAndUpdate(id, { isApproved: true }, { new: true })
      .exec();

    if (!updated) throw new NotFoundException('Mentor not found');

    return MentorMapper.toDomain(updated);
  }

  async getAllMentors(): Promise<Mentor[]> {
    const documents = await this.mentorModel.find({}).exec();
    // return documents.filter((doc) => this.toDomain(doc));
    return documents.map((doc) => MentorMapper.toDomain(doc));
  }

  // mentor count
  async totalMentorsCount(): Promise<number> {
    const count = await this.mentorModel.countDocuments();
    return count;
  }

  async getAllPendingMentors(): Promise<Mentor[]> {
    const documents = await this.mentorModel.find({ isApproved: false });
    return documents.map((doc) => MentorMapper.toDomain(doc));
  }

  async getAdminMentorList(params: {
    page?: number;
    limit?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResultDto<AdminUserListDto>> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const skip = (page - 1) * limit;

    const pipeline: PipelineStage[] = [
      //  Join Users
      {
        $lookup: {
          from: 'users',
          let: { userId: '$userId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', { $toObjectId: '$$userId' }],
                },
              },
            },
          ],
          as: 'user',
        },
      },
      { $unwind: '$user' },

      //Resolve status
      {
        $addFields: {
          status: {
            $cond: [
              { $eq: ['$isApproved', false] },
              'pending',
              {
                $cond: [
                  { $eq: ['$user.isBlocked', true] },
                  'blocked',
                  {
                    $cond: [
                      { $eq: ['$user.isActive', true] },
                      'active',
                      'inactive',
                    ],
                  },
                ],
              },
            ],
          },
        },
      },

      // Optional filtering
      ...(params.status ? [{ $match: { status: params.status } }] : []),

      //Sorting
      {
        $sort: {
          [params.sortBy ?? 'user.createdAt']:
            params.sortOrder === 'asc' ? 1 : -1,
        },
      },

      //Pagination + Count
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: 0,
                mentorId: '$_id',
                id: '$user._id',
                name: '$user.name',
                email: '$user.email',
                role: { $literal: 'Mentor' },
                status: 1,
                isEmailVerified: '$user.isEmailVerified',
                joinDate: '$user.createdAt',
                courses: '$totalCourses',
                rating: {
                  $cond: [
                    { $gt: [{ $size: '$ratings' }, 0] },
                    { $avg: '$ratings' },
                    0,
                  ],
                },
              },
            },
          ],
          meta: [{ $count: 'total' }],
        },
      },
    ];

    const result = await this.mentorModel
      .aggregate<AdminMentorAggregationResult>(pipeline)
      .exec();

    const total = result[0]?.meta[0]?.total ?? 0;

    return {
      data: result[0]?.data ?? [],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
