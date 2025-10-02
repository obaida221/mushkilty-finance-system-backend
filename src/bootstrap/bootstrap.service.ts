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

    for (const name of permissions) {
      const exists = await this.permRepo.findOne({ where: { name } });
      if (!exists) {
        const perm = new Permission();
        perm.name = name;
        await this.permRepo.save(perm);
      }
    }

    const allPerms = await this.permRepo.find({
      where: { name: In(permissions) },
    });

    // Seed roles
    const roles = [
      { name: 'admin', description: 'Full access' },
      { name: 'accountant', description: 'Manage transactions and reports' },
      { name: 'approver', description: 'Approve high-value transactions' },
      { name: 'viewer', description: 'Read-only access' },
    ];

    for (const r of roles) {
      const exists = await this.roleRepo.findOne({ where: { name: r.name } });
      if (!exists) {
        const role = new Role();
        role.name = r.name;
        role.description = r.description;
        await this.roleRepo.save(role);
      }
    }

    const admin = await this.roleRepo.findOne({ where: { name: 'admin' } });
    if (admin) {
      const existingRps = await this.rpRepo.find({
        where: { role: { id: admin.id } },
        relations: ['permission'],
      });

      const permIdSet = new Set(existingRps.map((rp) => rp.permission.id));

      for (const p of allPerms) {
        if (!permIdSet.has(p.id)) {
          const rp = new RolePermission();
          rp.role = admin;
          rp.permission = p;
          await this.rpRepo.save(rp);
        }
      }
    }

    // Seed admin user
    const anyUser = await this.userRepo.findOne({
      where: { email: 'admin@example.com' },
    });
    if (!anyUser && admin) {
      const password_hash = await bcrypt.hash('Admin@123', 10);
      const user = new User();
      user.email = 'admin@example.com';
      user.name = 'Bootstrap Admin';
      user.password_hash = password_hash;
      user.role = admin;
      await this.userRepo.save(user);
    }

    return { ok: true };
  }
}
