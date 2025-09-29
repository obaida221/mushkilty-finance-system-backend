import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Permission } from '../permissions/entities/permission.entity';
import { Role } from '../roles/entities/role.entity';
import { RolePermission } from '../roles/entities/role-permission.entity';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BootstrapService {
  constructor(
    @InjectRepository(Permission) private permRepo: Repository<Permission>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(RolePermission)
    private rpRepo: Repository<RolePermission>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async run() {
    // Seed permissions
    const permissions = [
      'transactions:create',
      'transactions:read',
      'transactions:update',
      'transactions:approve',
      'transactions:delete',
      'users:read',
      'users:create',
      'users:update',
      'users:delete',
      'roles:read',
      'roles:create',
      'roles:update',
      'roles:delete',
      'permissions:read',
      'permissions:create',
      'permissions:update',
      'permissions:delete',
    ];

    const existingPerms = await this.permRepo.find({ where: { name: In(permissions) } });
    const existingSet = new Set(existingPerms.map((p) => p.name));
    const toCreate = permissions
      .filter((name) => !existingSet.has(name))
      .map((name) => this.permRepo.create({ name }));
    if (toCreate.length) await this.permRepo.save(toCreate);

    const allPerms = await this.permRepo.find({ where: { name: In(permissions) } });

    // Seed roles
    const roles = [
      { name: 'admin', description: 'Full access' },
      { name: 'accountant', description: 'Manage transactions and reports' },
      { name: 'approver', description: 'Approve high-value transactions' },
      { name: 'viewer', description: 'Read-only access' },
    ];
    const existingRoles = await this.roleRepo.find();
    const roleNames = new Set(existingRoles.map((r) => r.name));
    const rolesToCreate = roles
      .filter((r) => !roleNames.has(r.name))
      .map((r) => this.roleRepo.create(r));
    if (rolesToCreate.length) await this.roleRepo.save(rolesToCreate);

    const admin = await this.roleRepo.findOne({ where: { name: 'admin' } });
    if (admin) {
      // Assign all permissions to admin
      const existingRps = await this.rpRepo.find({ where: { role_id: admin.id } });
      const permIdSet = new Set(existingRps.map((rp) => rp.permission_id));
      const rpsToCreate = allPerms
        .filter((p) => !permIdSet.has(p.id))
        .map((p) => this.rpRepo.create({ role_id: admin.id, permission_id: p.id }));
      if (rpsToCreate.length) await this.rpRepo.save(rpsToCreate);
    }

    // Seed admin user if none exists
    const anyUser = await this.userRepo.findOne({ where: { email: 'admin@example.com' } });
    if (!anyUser && admin) {
      const password_hash = await bcrypt.hash('Admin@123', 10);
      await this.userRepo.save(
        this.userRepo.create({
          email: 'admin@example.com',
          name: 'Bootstrap Admin',
          password_hash,
          role_id: admin.id,
        }),
      );
    }

    return { ok: true };
  }
}
