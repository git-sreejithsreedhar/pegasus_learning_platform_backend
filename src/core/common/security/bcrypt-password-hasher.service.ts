import * as bcrypt from 'bcrypt';
import { IPasswordService } from './password-hasher.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptPasswordHasher implements IPasswordService {
  hash(password: string, round: number = 10): Promise<string> {
    return bcrypt.hash(password, round);
  }

  compare(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed);
  }
}
