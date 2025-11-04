import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UsePipes, ValidationPipe } from '@nestjs/common';

import { CreateUserInput } from '../inputs/create-user.input';
import { User } from '../../domain/entities/users.entity'; // The GraphQL Output Type
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Mutation(() => User)
  // Ensures validation based on CreateUserInput's class-validator decorators
  @UsePipes(new ValidationPipe({ transform: true }))
  async createUser(
    // Args type is the GraphQL Input Type
    @Args('input') input: CreateUserInput,
  ): Promise<User> {
    // Pass the validated Input Type directly to the Use Case
    // The Use Case will handle the mapping to the internal DTO structure.
    return this.createUserUseCase.execute(input);
  }
}
