// src/permissions/permissions.controller.ts
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('permissions')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private service: PermissionsService) {}

  @Get()
  @Permissions('permissions:read')
  getAll() {
    return this.service.findAll();
  }

  @Post()
  @Permissions('permissions:create')
  create(@Body() dto: CreatePermissionDto) {
    return this.service.create(dto);
  }

  @Post('seed')
  @Permissions('permissions:update')
  async seed() {
    const base = [
      'transactions:create',
      'transactions:read',
      'transactions:update',
      'transactions:approve',
      'transactions:delete',
      'users:read',
      'users:update',
      'roles:read',
      'roles:create',
      'roles:update',
      'roles:delete',
      'permissions:read',
      'permissions:create',
      'permissions:update',
      'permissions:delete',
    ];
  const results: any[] = [];
    for (const name of base) {
      results.push(await this.service.ensure(name));
    }
    return { created: results.length };
  }
}
