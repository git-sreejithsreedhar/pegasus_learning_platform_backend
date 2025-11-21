// import { Field, InputType } from '@nestjs/graphql';

// @InputType()
// export class LoginInput {
//   @Field()
//   email: string;

//   @Field()
//   password: string;
// }

import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;
}
