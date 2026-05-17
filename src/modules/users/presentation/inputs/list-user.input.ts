import { Field, Int, InputType } from '@nestjs/graphql';

@InputType()
export class ListUsersInput {
  @Field(() => Int, { nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field({ nullable: true })
  search?: string;

  @Field({ nullable: true })
  role?: string;
}
