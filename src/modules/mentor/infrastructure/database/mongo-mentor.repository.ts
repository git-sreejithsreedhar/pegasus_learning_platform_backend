import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mentor } from '../../domain/entities/mentor.entity';
import { IMentorRepository } from '../../domain/interface/mentor.-repository.interface';
import { MentorDocument, MentorModel } from './models/mentor.schema';
import { PagePaginationQuery } from 'src/core/common/pagination/pagination.interface';
import { mongoPagePaginate } from 'src/core/common/pagination/mongo-pagination.util';

@Injectable()
export class MentorRepository implements IMentorRepository {
  constructor(
    @InjectModel(MentorModel.name)
    private readonly mentorModel: Model<MentorDocument>,
  ) {}

  async findWithPagination(query: PagePaginationQuery) {
    return mongoPagePaginate(
      this.mentorModel,
      {},
      query.page ?? 1,
      query.limit ?? 10,
    );
  }

  async create(data: Mentor): Promise<Mentor> {
    const doc = new this.mentorModel(data);
    const saved = await doc.save();
    return this.toDomain(saved);
  }

  async update(id: string, data: Partial<Mentor>): Promise<Mentor> {
    const updated = await this.mentorModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();

    if (!updated) throw new NotFoundException('Mentor not found');
    return this.toDomain(updated);
  }

  async findByUserId(userId: string): Promise<Mentor | null> {
    const doc = await this.mentorModel.findOne({ userId }).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async findById(id: string): Promise<Mentor | null> {
    const doc = await this.mentorModel.findById(id).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async approveMentor(id: string): Promise<Mentor> {
    const updated = await this.mentorModel
      .findByIdAndUpdate(id, { isApproved: true }, { new: true })
      .exec();

    if (!updated) throw new NotFoundException('Mentor not found');

    return this.toDomain(updated);
  }

  async getAllMentors(): Promise<Mentor[]> {
    const documents = await this.mentorModel.find({}).exec();
    return documents.filter((doc) => this.toDomain(doc));
  }

  private toDomain(doc: MentorDocument): Mentor {
    return new Mentor(
      doc._id,
      doc.userId,
      doc.primarySkill,
      doc.expertise,
      doc.skillProficiency,
      doc.yearsExperience,
      doc.about,
      doc.profile,
      doc.socialLinks,
      doc.documents,
      doc.totalStudents,
      doc.totalCourses,
      doc.reviews,
      doc.completionRate,
      doc.ratings,
      doc.isApproved,
      doc.communicationPref,
      doc.hourlyRate,
    );
  }
}
