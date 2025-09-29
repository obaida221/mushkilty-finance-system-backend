import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolePermission } from './entities/role-permission.entity';
import { Permission } from '../permissions/entities/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private repo: Repository<Role>,
    @InjectRepository(RolePermission)
    private rpRepo: Repository<RolePermission>,
    @InjectRepository(Permission)
    private permRepo: Repository<Permission>,
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

  // Assign a list of permission names to a role (replaces existing if replace=true)
  async assignPermissions(
    roleId: number,
    permissionNames: string[],
    replace = false,
  ) {
    const role = await this.repo.findOne({ where: { id: roleId } });
    if (!role) throw new Error('Role not found');

    const perms = await this.permRepo.find({
      where: { name: In(permissionNames) },
    });

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
}
