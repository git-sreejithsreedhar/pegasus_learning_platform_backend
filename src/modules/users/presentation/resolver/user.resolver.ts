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
