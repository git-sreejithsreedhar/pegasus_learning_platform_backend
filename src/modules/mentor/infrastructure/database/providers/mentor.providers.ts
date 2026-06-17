import { MENTOR_REPOSITORY_TOKEN } from 'src/modules/mentor/domain/tokens/injection-tokens.constant';
import { MentorRepository } from '../mongo-mentor.repository';
import { Provider } from '@nestjs/common';

export const MentorProviders: Provider[] = [
  {
    provide: MENTOR_REPOSITORY_TOKEN,
    useClass: MentorRepository,
  },
];
