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
}
