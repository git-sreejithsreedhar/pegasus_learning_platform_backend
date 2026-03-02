import { forwardRef, Module } from '@nestjs/common';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { PASSWORD_SERVICE, USER_REPOSITORY } from './domain/tokens/tokens';
import { User } from './domain/entities/users.entity';
import { UserSchema } from './infrastructure/database/models/user.schema';
import { BcryptPasswordHasher } from 'src/core/common/security/bcrypt-password-hasher.service';
import { UserController } from './presentation/controller/user.controller';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';
import { UserUsecaseProviders } from './application/user-usecase.provider';

@Module({
  controllers: [UserController],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
    WinstonModule,
  ],

  providers: [
    // UsersResolver
    CreateUserUseCase,

    // User usecase provider
    ...UserUsecaseProviders,
    {
      provide: PASSWORD_SERVICE,
      useClass: BcryptPasswordHasher,
    },
  ],

  exports: [USER_REPOSITORY],
})
export class UsersModule {}
