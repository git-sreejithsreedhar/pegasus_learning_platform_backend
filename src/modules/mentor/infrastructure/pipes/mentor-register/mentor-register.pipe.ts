import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { MentorRegisterDto } from 'src/modules/mentor/presentation/dto/create-mentor.dto';

@Injectable()
export class MentorRegisterPipe
  implements PipeTransform<unknown, Promise<MentorRegisterDto>>
{
  async transform(value: unknown): Promise<MentorRegisterDto> {
    if (!value || typeof value !== 'object') {
      throw new BadRequestException('Invalid request body');
    }

    const body = value as Record<string, unknown>;

    const parsedBody = {
      phone: body.phone,
      about: body.about,
      primarySkill: body.primarySkill,
      communicationPref: body.communicationPref,

      skillProficiency: Number(body.skillProficiency),
      yearsExperience: Number(body.yearsExperience),
      hourlyRate: Number(body.hourlyRate),

      expertise: this.safeJsonParse<string[]>(body.expertise, []),
      profile: this.safeJsonParse<{ bio: string }>(body.profile, { bio: '' }),
      socialLinks: this.safeJsonParse<Record<string, string>>(
        body.socialLinks,
        {},
      ),
    };

    const dto = plainToInstance(MentorRegisterDto, parsedBody, {
      enableImplicitConversion: true,
    });

    const errors = await validate(dto);
    if (errors.length > 0) {
      // throw new BadRequestException(errors);
      console.log('DTO VALIDATION ERRORS:', JSON.stringify(errors, null, 2));
      throw new BadRequestException(errors);
    }

    return dto;
  }

  private safeJsonParse<T>(value: unknown, fallback: T): T {
    if (!value) return fallback;

    try {
      return typeof value === 'string'
        ? (JSON.parse(value) as T)
        : (value as T);
    } catch {
      return fallback;
    }
  }
}
