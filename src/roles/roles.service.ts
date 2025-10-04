import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolePermission } from './entities/role-permission.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private repo: Repository<Role>,
    @InjectRepository(RolePermission)
    private rpRepo: Repository<RolePermission>,
    @InjectRepository(Permission)
    private permRepo: Repository<Permission>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  findAll(): Promise<Role[]> {
    return this.repo.find();
  }

  findOne(id: number): Promise<Role | null> {
    return this.repo.findOne({ where: { id } });
  }

  create(data: CreateRoleDto): Promise<Role> {
    const role = this.repo.create(data);
    return this.repo.save(role);
  }

  update(id: number, data: UpdateRoleDto): Promise<Role> {
    return this.repo.save({ id, ...data });
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  // Assign a single permission to a role
  async assignSinglePermission(roleId: number, permissionId: number) {
    const role = await this.repo.findOne({ where: { id: roleId } });
    if (!role) throw new Error('Role not found');

    const permission = await this.permRepo.findOne({ where: { id: permissionId } });
    if (!permission) throw new Error('Permission not found');

    // Check if permission is already assigned
    const existing = await this.rpRepo.findOne({ 
      where: { role_id: roleId, permission_id: permissionId } 
    });

    if (existing) {
      return { 
        message: 'Permission already assigned to role',
        role,
        permission 
      };
    }

    // Assign the permission
    const rolePermission = this.rpRepo.create({ 
      role_id: roleId, 
      permission_id: permissionId 
    });
    await this.rpRepo.save(rolePermission);

    return { 
      message: 'Permission successfully assigned to role',
      role,
      permission 
    };
  }

  // Remove a single permission from a role
  async removeSinglePermission(roleId: number, permissionId: number) {
    const role = await this.repo.findOne({ where: { id: roleId } });
    if (!role) throw new Error('Role not found');

    const permission = await this.permRepo.findOne({ where: { id: permissionId } });
    if (!permission) throw new Error('Permission not found');

    // Check if permission is assigned
    const existing = await this.rpRepo.findOne({ 
      where: { role_id: roleId, permission_id: permissionId } 
    });

    if (!existing) {
      return { 
        message: 'Permission is not assigned to this role',
        role,
        permission 
      };
    }

    // Remove the permission
    await this.rpRepo.delete({ role_id: roleId, permission_id: permissionId });

    return { 
      message: 'Permission successfully removed from role',
      role,
      permission 
    };
  }

  // Assign a list of permission names to a role (replaces existing if replace=true)
  async assignPermissions(
    roleId: number,
    permissionNames: string[] = [],
    replace = false,
    permissionIds: number[] = [],
  ) {
    const role = await this.repo.findOne({ where: { id: roleId } });
    if (!role) throw new Error('Role not found');

    let perms: Permission[] = [];
    if (permissionNames && permissionNames.length) {
      perms = await this.permRepo.find({ where: { name: In(permissionNames) } });
    }
    if (permissionIds && permissionIds.length) {
      const byIds = await this.permRepo.find({ where: { id: In(permissionIds) } });
      perms = [...perms, ...byIds];
    }
    // de-duplicate perms by id
    const unique = new Map(perms.map((p) => [p.id, p]));
    perms = Array.from(unique.values());

    if (replace) {
      await this.rpRepo.delete({ role_id: roleId });
    }

    const existing = await this.rpRepo.find({ where: { role_id: roleId } });
    const existingSet = new Set(existing.map((e) => e.permission_id));

    const toInsert = perms
      .filter((p) => !existingSet.has(p.id))
      .map((p) => this.rpRepo.create({ role_id: roleId, permission_id: p.id }));

    if (toInsert.length) await this.rpRepo.save(toInsert);

    return this.rpRepo.find({ where: { role_id: roleId }, relations: ['permission'] });
  }

  // Get permissions for a specific role
  async getRolePermissions(roleId: number) {
    const role = await this.repo.findOne({ where: { id: roleId } });
    if (!role) throw new Error('Role not found');

    const rolePermissions = await this.rpRepo.find({ 
      where: { role_id: roleId }, 
      relations: ['permission'] 
    });

    return {
      role: role,
      permissions: rolePermissions.map(rp => rp.permission)
    };
  }

  // Get current user's role permissions
  async getCurrentUserPermissions(userId: number) {
    const user = await this.userRepo.findOne({ 
      where: { id: userId },
      relations: ['role']
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.role) {
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        role: null,
        permissions: []
      };
    }

    const rolePermissions = await this.rpRepo.find({ 
      where: { role_id: user.role.id }, 
      relations: ['permission'] 
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      role: user.role,
      permissions: rolePermissions.map(rp => rp.permission)
    };
  }
}
