import {
  Body,
  Controller,
  Post,
  // UsePipes,
  // ValidationPipe,
} from '@nestjs/common';
import { CreateUserInput } from '../inputs/create-user.input';
import { UserModel } from '../models/user.type';
import { UserMapper } from '../mappers/user.mapper';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';

@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post('signup')
  async createUser(@Body() input: CreateUserInput): Promise<UserModel> {
    const dto = UserMapper.toCreateUserDto(input);
    return await this.createUserUseCase.execute(dto);
  }
}
