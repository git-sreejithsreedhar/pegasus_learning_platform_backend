// src/modules/users/presentation/types/profile.type.ts
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ProfileType {
  @Field()
  name: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  bio?: string;
}
