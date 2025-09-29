import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { RolePermission } from '../../roles/entities/role-permission.entity';
import { Permission } from '../../permissions/entities/permission.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(RolePermission)
    private readonly rolePermRepo: Repository<RolePermission>,
    @InjectRepository(Permission)
    private readonly permRepo: Repository<Permission>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required || required.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.role) {
      throw new ForbiddenException('Access denied: no role set');
    }

    // fetch permissions for this role
    const rows = await this.rolePermRepo.find({
      where: { role_id: user.role },
      relations: ['permission'],
    });

    const names = new Set(rows.map((r) => r.permission?.name).filter(Boolean));

    const ok = required.every((p) => names.has(p));
    if (!ok) {
      throw new ForbiddenException('Access denied: missing permission');
    }
    return true;
  }
}
