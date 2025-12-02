// import { InjectModel } from '@nestjs/mongoose';
// import { MentorDocumentsDto } from '../../application/dtos/mentor.dto';
// import { IMentorRepository } from '../../application/interfaces/mentor-repository.interface';
// import { MentorModel } from './models/mentor.schema';
// import { Model } from 'mongoose';

// export class MongoMentorRepository implements IMentorRepository {
//   constructor(
//     @InjectModel(MentorModel.name)
//     private readonly mentorModel: Model<MentorModel>,
//   ) {}

//   async create(data: MentorDocumentsDto): Promise<MentorDocumentsDto> {
//     const mentor = await new this.mentorModel(data).save();
//     return mentor.toObject();
//   }

//   async findById(id: string): Promise<MentorDocumentsDto> {
//     return this.mentorModel.findById(id).lean();
//   }

//   async updateById(
//     id: string,
//     data: Partial<MentorDocumentsDto>,
//   ): Promise<MentorDocumentsDto> {
//     return this.mentorModel.findByIdAndUpdate(id, data, { new: true }).lean();
//   }

//   async addDocuments(
//     id: string,
//     documents: Record<string, string>,
//   ): Promise<MentorDocumentsDto> {
//     return this.mentorModel
//       .findByIdAndUpdate(id, { $set: { documents } }, { new: true })
//       .lean();
//   }
// }
