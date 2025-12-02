import { PendingMentorRequestDto } from '../../presentation/requestDto/pending-mentor-request.dto';
import { PendingMentorResponseDto } from '../dtos/pending-mentor-response.dto';

export interface IPendingMentorRepository {
  create(data: PendingMentorRequestDto): Promise<PendingMentorResponseDto>;
  findById(id: string): Promise<PendingMentorResponseDto>;
  delete(id: string): Promise<void>;
}
