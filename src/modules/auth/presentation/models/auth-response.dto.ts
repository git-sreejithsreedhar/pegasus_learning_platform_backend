import { Field, ObjectType } from '@nestjs/graphql';
import { UserModel } from 'src/modules/users/presentation/models/user.type';

@ObjectType()
export class AuthResponse {
  @Field(() => UserModel, { nullable: true })
  user: UserModel | null;

  @Field(() => String, { nullable: true })
  accessToken: string | null;

  @Field(() => String, { nullable: true })
  refreshToken: string | null;
}
