import { forwardRef, Module } from '@nestjs/common';
// import { UsersResolver } from './presentation/resolver/user.resolver';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { MongoUserRepository } from './infrastructure/database/repositories/mongo-user.repository';
import { PASSWORD_SERVICE, USER_REPOSITORY } from './domain/tokens/tokens';
import { User } from './domain/entities/users.entity';
import { UserSchema } from './infrastructure/database/models/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { BcryptPasswordHasher } from 'src/core/common/security/bcrypt-password-hasher.service';
import { UserController } from './presentation/controller/user.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [UserController],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
  ],
  providers: [
    // UsersResolver,
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
