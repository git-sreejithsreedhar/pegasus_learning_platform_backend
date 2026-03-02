import { Types } from 'mongoose';
import { CreateUserDto } from 'src/modules/users/application/dtos/create-user.dto';

export enum UserRole {
  STUDENT = 'student',
  MENTOR = 'mentor',
  ADMIN = 'admin',
  USER = 'USER',
}

export interface toDomain {
  _id: string;
  email: string;
  password: string;
  name: string;
  avatar: string;
  roles: UserRole[];
  isActive: boolean;
  isBlocked: boolean;
  isEmailVerified: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserReconstitutionProps {
  _id: string;
  email: string;
  password: string;
  name: string;
  avatar?: string;
  roles: UserRole[];
  isActive: boolean;
  isBlocked: boolean;
  isEmailVerified: boolean;
  lastLogin?: Date;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  save() {
    throw new Error('Method not implemented.');
  }
  public readonly _id: string;
  public email: string;
  public name: string;
  public avatar: string;
  public roles: UserRole[];
  public isActive: boolean;
  public isBlocked: boolean;
  public isEmailVerified: boolean;
  public auth0Id?: string;
  public password?: string;
  public lastLogin?: Date;
  public refreshToken?: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  private constructor(
    _id: string,
    email: string,
    name: string,
    avatar: string,
    roles: UserRole[],
    isActive: boolean,
    isBlocked = false,
    isEmailVerified = false,
    auth0Id?: string,
    password?: string,
    lastLogin?: Date,
    refreshToken?: string,
    createdAt = new Date(),
    updatedAt = new Date(),
  ) {
    this._id = _id;
    this.email = email;
    this.name = name;
    this.avatar = avatar;
    this.roles = roles;
    this.isActive = isActive;
    this.isBlocked = isBlocked;
    this.isEmailVerified = isEmailVerified;
    this.auth0Id = auth0Id;
    this.password = password;
    this.lastLogin = lastLogin;
    this.refreshToken = refreshToken;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(dto: CreateUserDto): User {
    const now = new Date();
    return new User(
      new Types.ObjectId().toString(),
      dto.email,
      dto.name,
      dto.avatar ?? '',
      dto.roles ?? [UserRole.STUDENT],
      true, // isActive
      false, // isBlocked
      false, // isEmailVerified
      undefined, // auth0Id
      dto.password, // password
      undefined, // lastLogin
      undefined, // refreshToken
      now,
      now,
    );
  }

  static createSocial(data: {
    email: string;
    name: string;
    avatar: string;
    auth0Id: string;
  }): User {
    const now = new Date();
    return new User(
      new Types.ObjectId().toString(),
      data.email,
      data.name,
      data.avatar,
      [UserRole.STUDENT],
      true, // isActive
      false, // isBlocked
      true, // isEmailVerified
      data.auth0Id, // auth0Id
      undefined, // password (social users have no password)
      undefined, // lastLogin
      undefined, // refreshToken
      now,
      now,
    );
  }

  static reconstitute(props: {
    _id: string;
    email: string;
    password?: string; // optional to support social users
    name: string;
    avatar: string;
    roles: UserRole[];
    isActive: boolean;
    isBlocked: boolean;
    isEmailVerified: boolean;
    lastLogin?: Date;
    refreshToken?: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      props._id,
      props.email,
      props.name,
      props.avatar,
      props.roles,
      props.isActive,
      props.isBlocked,
      props.isEmailVerified,
      undefined, // auth0Id (add to props if needed)
      props.password,
      props.lastLogin,
      props.refreshToken,
      props.createdAt,
      props.updatedAt,
    );
  }

  activate(): void {
    this.isActive = true;
    this.touch();
  }

  deactivate(): void {
    this.isActive = false;
    this.touch();
  }

  block(): void {
    this.isBlocked = true;
    this.touch();
  }

  unblock(): void {
    this.isBlocked = false;
    this.touch();
  }

  verifyEmail(): void {
    this.isEmailVerified = true;
    this.touch();
  }

  updateLastLogin(): void {
    this.lastLogin = new Date();
    this.touch();
  }

  addRole(role: UserRole): void {
    if (!this.roles.includes(role)) {
      this.roles.push(role);
    }
    this.touch();
  }

  removeRole(role: UserRole): void {
    this.roles = this.roles.filter((r) => r !== role);
    this.touch();
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}
