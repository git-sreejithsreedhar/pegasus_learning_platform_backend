import { MentorRegisterDto } from '../dtos/mentor-register.dto';
import { MentorVerificationStatusDto } from '../dtos/mentor.dto';

export interface IMentorRegisterUsecase {
  execute(data: MentorRegisterDto): Promise<MentorVerificationStatusDto>;
}
