import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('roles')
@ApiBearerAuth('bearer')
@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly service: RolesService) {}

  @Get()
  @Permissions('roles:read')
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Permissions('roles:read')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @Permissions('roles:create')
  create(@Body() dto: CreateRoleDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @Permissions('roles:update')
  update(@Param('id') id: number, @Body() dto: UpdateRoleDto) {
    return this.service.update(id, dto);
  }

  @Post(':id/permissions')
  @Permissions('roles:update')
  assignPermissions(
    @Param('id') id: number,
    @Body() dto: import('./dto/assign-permissions.dto').AssignPermissionsDto,
  ) {
    return this.service.assignPermissions(id, dto.permissions, dto.replace);
  }

  // Basic seed to create a few roles quickly (protect or remove in prod)
  @Post('seed')
  @Permissions('roles:create')
  seed() {
    const base = [
      { name: 'admin', description: 'Full access' },
      { name: 'accountant', description: 'Manage transactions and reports' },
      { name: 'approver', description: 'Approve high-value transactions' },
      { name: 'viewer', description: 'Read-only access' },
    ];
    return Promise.all(
      base.map((r) =>
        this.service.create(r as any).catch(() => undefined),
      ),
    );
  }

  @Delete(':id')
  @Permissions('roles:delete')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
