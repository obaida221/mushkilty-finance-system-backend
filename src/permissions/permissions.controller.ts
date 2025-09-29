// src/permissions/permissions.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private service: PermissionsService) {}

  @Get()
  getAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() dto: CreatePermissionDto) {
    return this.service.create(dto);
  }
}
