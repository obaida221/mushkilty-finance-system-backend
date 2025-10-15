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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('roles')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly service: RolesService) {}

  @Get()
  @Permissions('roles:read')
  findAll() {
    return this.service.findAll();
  }

  @Get('me/permissions')
  // @Permissions('roles:read')
  @ApiOperation({
    summary: "Get current user's role permissions",
    description:
      "Retrieve all permissions for the currently authenticated user's role.",
  })
  getCurrentUserPermissions(@CurrentUser() user: any) {
    return this.service.getCurrentUserPermissions(user.id);
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

  @Post(':roleId/permissions/:permissionId')
  @Permissions('roles:update')
  @ApiOperation({
    summary: 'Assign a single permission to a role',
    description:
      'Assign a specific permission to a role using role ID and permission ID as path parameters.',
  })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiParam({ name: 'permissionId', description: 'Permission ID' })
  assignSinglePermission(
    @Param('roleId') roleId: number,
    @Param('permissionId') permissionId: number,
  ) {
    return this.service.assignSinglePermission(roleId, permissionId);
  }

  @Delete(':roleId/permissions/:permissionId')
  @Permissions('roles:update')
  @ApiOperation({
    summary: 'Remove a single permission from a role',
    description:
      'Remove a specific permission from a role using role ID and permission ID as path parameters.',
  })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiParam({ name: 'permissionId', description: 'Permission ID' })
  removeSinglePermission(
    @Param('roleId') roleId: number,
    @Param('permissionId') permissionId: number,
  ) {
    return this.service.removeSinglePermission(roleId, permissionId);
  }

  @Post(':id/permissions')
  @Permissions('roles:update')
  @ApiOperation({
    summary: 'Assign multiple permissions to a role',
    description:
      'Assign multiple permissions to a role by role ID. You can use permission names or permission IDs.',
  })
  @ApiParam({ name: 'id', description: 'Role ID' })
  assignPermissions(
    @Param('id') id: number,
    @Body() dto: import('./dto/assign-permissions.dto').AssignPermissionsDto,
  ) {
    return this.service.assignPermissions(
      id,
      dto.permissions ?? [],
      dto.replace,
      dto.permissionIds ?? [],
    );
  }

  @Get(':id/permissions')
  @Permissions('roles:read')
  @ApiOperation({
    summary: 'Get permissions for a specific role',
    description:
      'Retrieve all permissions assigned to a specific role by role ID.',
  })
  @ApiParam({ name: 'id', description: 'Role ID' })
  getRolePermissions(@Param('id') id: number) {
    return this.service.getRolePermissions(id);
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
      base.map((r) => this.service.create(r as any).catch(() => undefined)),
    );
  }

  @Delete(':id')
  @Permissions('roles:delete')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
