// import { Resolver, Mutation, Args } from '@nestjs/graphql';
// import { UsePipes, ValidationPipe } from '@nestjs/common';

// import { CreateUserInput } from '../inputs/create-user.input';
// import { User } from '../../domain/entities/users.entity'; // The GraphQL Output Type
// import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';

// @Resolver(() => CreateUserInput)
// export class UsersResolver {
//   constructor(private readonly createUserUseCase: CreateUserUseCase) {}

//   @Mutation(() => User)
//   // Ensures validation based on CreateUserInput's class-validator decorators
//   @UsePipes(new ValidationPipe({ transform: true }))
//   async createUser(
//     // Args type is the GraphQL Input Type
//     @Args('input') input: CreateUserInput,
//   ): Promise<User> {
//     // Pass the validated Input Type directly to the Use Case
//     // The Use Case will handle the mapping to the internal DTO structure.
//     return this.createUserUseCase.execute(input);
//   }
// }

// src/modules/users/presentation/resolvers/users.resolver.ts
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UsePipes, ValidationPipe } from '@nestjs/common';

import { CreateUserInput } from '../inputs/create-user.input';

import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { UserMapper } from '../mappers/user.mapper';
import { UserModel } from '../models/user.type';

@Resolver(() => UserModel)
export class UsersResolver {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Mutation(() => UserModel)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createUser(@Args('input') input: CreateUserInput): Promise<UserModel> {
    const dto = UserMapper.toCreateUserDto(input);
    const user = await this.createUserUseCase.execute(dto);
    // console.log(user)
    return user;
  }
}
