export interface IPasswordService {
  hash(password: string, round?: number | string): Promise<string>;
  compare(password: string, hashed: string): Promise<boolean>;
}
