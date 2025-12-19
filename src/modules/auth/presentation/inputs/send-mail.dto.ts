import { IsEmail, IsString } from 'class-validator';

export class sendMailDto {
  @IsString()
  userId: string;

  @IsEmail()
  email: string;
}
