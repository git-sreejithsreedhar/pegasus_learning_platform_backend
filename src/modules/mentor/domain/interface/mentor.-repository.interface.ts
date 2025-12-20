import { Mentor } from '../entities/mentor.entity';

export const MENTOR_REPOSITORY_TOKEN = Symbol('IMENTOR_REPOSITORY_TOKEN');

export interface IMentorRepository {
  create(data: Mentor): Promise<Mentor>;
  update(id: string, data: Partial<Mentor>): Promise<Mentor>;
  findByUserId(userId: string): Promise<Mentor | null>;
  findById(id: string): Promise<Mentor | null>;
  approveMentor(id: string): Promise<Mentor>;
}
