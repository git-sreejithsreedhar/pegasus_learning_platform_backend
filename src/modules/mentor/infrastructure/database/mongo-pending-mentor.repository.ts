import { Model } from 'mongoose';
import { IPendingMentorRepository } from '../../application/interfaces/pending-mentor.repository.interface';
import { PendingMentorModel } from './models/pending-mentor.schema';
import { InjectModel } from '@nestjs/mongoose';
import { PendingMentorRequestDto } from '../../presentation/requestDto/pending-mentor-request.dto';
import { PendingMentorResponseDto } from '../../application/dtos/pending-mentor-response.dto';

export class MongoPendingMentorRepository implements IPendingMentorRepository {
  constructor(
    @InjectModel(PendingMentorModel.name)
    private readonly pendingMentorModel: Model<PendingMentorModel>,
  ) {}

  async create(
    data: PendingMentorRequestDto,
  ): Promise<PendingMentorResponseDto> {
    const created = new this.pendingMentorModel(data);
    const saved = await created.save();
    return saved.toObject() as PendingMentorResponseDto;
  }

  async findById(id: string): Promise<PendingMentorResponseDto> {
    const mentor = await this.pendingMentorModel.findById(id).lean();
    return mentor as PendingMentorResponseDto;
  }

  async delete(id: string): Promise<void> {
    await this.pendingMentorModel.findByIdAndDelete(id).exec();
  }
}
