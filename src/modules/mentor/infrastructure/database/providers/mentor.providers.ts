import { MentorRepository } from '../mongo-mentor.repository';
import { Provider } from '@nestjs/common';
import { MENTOR_REPOSITORY_TOKEN } from 'src/modules/mentor/domain/interface/mentor.-repository.interface';

export const MentorProviders: Provider[] = [
  {
    provide: MENTOR_REPOSITORY_TOKEN,
    useClass: MentorRepository,
  },
];
