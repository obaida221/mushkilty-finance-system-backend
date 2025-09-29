// src/permissions/permissions.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private repo: Repository<Permission>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  create(data: CreatePermissionDto) {
    return this.repo.save(data);
  }

  async ensure(name: string, description?: string) {
    let perm = await this.repo.findOne({ where: { name } });
    if (!perm) {
      perm = this.repo.create({ name, description });
      perm = await this.repo.save(perm);
    }
    return perm;
  }
}
