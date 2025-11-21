import { Module } from '@nestjs/common';
import { UsersResolver } from './presentation/resolver/user.resolver';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { MongoUserRepository } from './infrastructure/database/repositories/mongo-user.repository';
import { PASSWORD_SERVICE, USER_REPOSITORY } from './domain/tokens/tokens';
import { User } from './domain/entities/users.entity';
import { UserSchema } from './infrastructure/database/models/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { BcryptPasswordHasher } from 'src/core/common/security/bcrypt-password-hasher.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    UsersResolver,
    CreateUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: MongoUserRepository,
    },
    {
      provide: PASSWORD_SERVICE,
      useClass: BcryptPasswordHasher,
    },
  ],

  exports: [USER_REPOSITORY, PASSWORD_SERVICE],
})
export class UsersModule {}
