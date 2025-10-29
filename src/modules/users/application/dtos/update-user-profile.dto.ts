import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { UpdateProfileDto } from './update-profile.dto';
import { Type } from 'class-transformer/types/decorators/type.decorator';

export class updateUserProfileDto {
  @ValidateNested()
  @Type(() => UpdateProfileDto)
  @IsOptional()
  profile?: UpdateProfileDto;

  @IsArray()
  @IsOptional()
  prferences?: string[][];
}
