// src/features/users/presentation/UserController.resolver.ts

import { Resolver } from '@nestjs/graphql';
import { CreateUserDto } from '../../application/dtos/create-user.dto';

// import { Resolver, Mutation, Args } from '@nestjs/graphql';
// import { CreateUserUseCase } from '../../application/usecases/create-user.usecase'; // Application Layer

// // Import your Presentation DTOs (GraphQL Input/Output Types)
// import { UserObject } from '../dto/user.object';
// import { CreateUserInput } from '../dto/create-user.input'; // Includes confirmPassword
// import { AuthPayload } from '../dto/auth.payload.object'; // Assuming this is your response shape

// @Resolver(() => UserObject)
// export class UserResolver {
//   // 1. Inject the Use Case from the Application Layer
//   constructor(
//     private readonly createUserUseCase: CreateUserUseCase,
//   ) {}

//   // ... Resolver methods follow
// }

@Resolver(() => CreateUserDto)
export class UserResolver {
  constructor() {}
}
