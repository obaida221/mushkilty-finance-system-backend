import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { RolePermission } from '../../roles/entities/role-permission.entity';
import { Permission } from '../../permissions/entities/permission.entity';

interface RequestWithUser extends Request {
  user?: {
    role_id: number;
    [key: string]: unknown;
  };
}

interface PermissionResult {
  permission_name: string;
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(RolePermission)
    private rolePermissionRepo: Repository<RolePermission>,
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user || !user.role_id) {
      throw new ForbiddenException('User role not found');
    }

    // Get user's permissions through their role
    const userPermissions = await this.rolePermissionRepo
      .createQueryBuilder('rp')
      .innerJoin('rp.permission', 'permission')
      .select('permission.name')
      .where('rp.role_id = :roleId', { roleId: user.role_id })
      .getRawMany();

    const userPermissionNames = userPermissions.map(
      (p: PermissionResult) => p.permission_name,
    );

    // Check if user has all required permissions
    const hasPermission = requiredPermissions.every((permission) =>
      userPermissionNames.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `Insufficient permissions. Required: ${requiredPermissions.join(', ')}`,
      );
    }

    return true;
  }
}
