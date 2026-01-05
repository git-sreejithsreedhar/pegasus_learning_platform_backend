import { Types } from 'mongoose';
import { CreateUserDto } from 'src/modules/users/application/dtos/create-user.dto';

export enum UserRole {
  STUDENT = 'student',
  MENTOR = 'mentor',
  ADMIN = 'admin',
  USER = 'USER',
}

// export class UserProfile {
//   constructor(
//     public name: string,
//     public avatar?: string,
//     public bio?: string,
//   ) {}
// }

export interface toDomain {
  _id: string;
  email: string;
  password: string;
  name: string;
  // role: string;
  roles: UserRole[];
  // profile: UserProfile;
  isActive: boolean;
  isBlocked: boolean;
  isEmailVerified: boolean;
  // preferences: string[];
  lastLogin: Date;
  // refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserReconstitutionProps {
  _id: string;
  email: string;
  password: string;
  name: string;
  // role: UserRole;
  roles: UserRole[];
  // profile: UserProfile;
  isActive: boolean;
  isBlocked: boolean;
  isEmailVerified: boolean;
  // preferences: string[];
  lastLogin?: Date;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  public readonly _id: string;
  public email: string;
  public password: string;
  public name: string;
  // public role: UserRole;
  public roles: UserRole[];
  // public profile: UserProfile;
  public isActive: boolean;
  public isBlocked: boolean;
  public isEmailVerified: boolean;
  // public preferences: string[];
  public lastLogin?: Date;
  public refreshToken?: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  private constructor(
    _id: string,
    email: string,
    password: string,
    name: string,
    // role: UserRole,
    roles: UserRole[],
    // profile: UserProfile,
    isActive: boolean,
    isBlocked = false,
    isEmailVerified = false,
    // preferences: string[] = [],
    lastLogin?: Date,
    refreshToken?: string,
    createdAt = new Date(),
    updatedAt = new Date(),
  ) {
    this._id = _id;
    this.email = email;
    this.password = password;
    this.name = name;
    // this.role = role;
    this.roles = roles;
    // this.profile = profile;
    this.isActive = isActive;
    this.isBlocked = isBlocked;
    this.isEmailVerified = isEmailVerified;
    // this.preferences = preferences;
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
      dto.password,
      dto.name,
      dto.roles ?? [UserRole.STUDENT],
      // dto.profile,
      true,
      false,
      false,
      undefined,
      undefined,
      now,
      now,
    );
  }

  // rebulding from database
  static reconstitute(props: {
    _id: string;
    email: string;
    password: string;
    name: string;
    roles: UserRole[];
    // profile: UserProfile;
    isActive: boolean;
    isBlocked: boolean;
    isEmailVerified: boolean;
    // preferences: string[];
    lastLogin?: Date;
    refreshToken?: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      props._id,
      props.email,
      props.password,
      props.name,
      props.roles,
      // props.profile,
      props.isActive,
      props.isBlocked,
      props.isEmailVerified,
      // props.preferences,
      props.lastLogin,
      props.refreshToken,
      props.createdAt,
      props.updatedAt,
    );
  }

  //Domain Behaviors
  // updateProfile(profile: Partial<UserProfile>): void {
  //   this.profile = { ...this.profile, ...profile };
  //   this.touch();
  // }

  // updatePreferences(preferences: string[]): void {
  //   this.preferences = preferences;
  //   this.touch();
  // }

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

// permissions
// export const Permissions = {
//   [UserRole.STUDENT]: [
//     { resource: 'courses', actions: ['read', 'enroll'] },
//     { resource: 'profile', actions: ['read', 'update'] },
//   ],
//   [UserRole.INSTRUCTOR]: [
//     { resource: 'courses', actions: ['read', 'create', 'update', 'delete'] },
//     { resource: 'enrollments', actions: ['read'] },
//     { resource: 'profile', actions: ['read', 'update'] },
//   ],
//   [UserRole.ADMIN]: [{ resource: '*', actions: ['*'] }],
// };
