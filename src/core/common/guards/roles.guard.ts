import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

export type Role = 'admin' | 'user' | 'editor';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.get<Role[]>('roles', context.getHandler()) ?? [];

    // Ensure requiredRoles is an array
    if (!Array.isArray(requiredRoles)) {
      throw new ForbiddenException('Invalid role metadata');
    }

    const request = context.switchToHttp().getRequest<Request>();

    // Type your user properly (NOT any)
    const user = request.user as { roles: Role[] } | undefined;

    if (!user || !Array.isArray(user.roles)) {
      throw new ForbiddenException('User roles missing');
    }

    const hasRole = requiredRoles.some((role) => user.roles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}

// @Roles(UserRole.Admin)
