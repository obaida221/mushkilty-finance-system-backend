import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsGuard } from './guards/permissions.guard';
import { RolePermission } from '../roles/entities/role-permission.entity';
import { Permission } from '../permissions/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RolePermission, Permission])],
  providers: [PermissionsGuard],
  exports: [PermissionsGuard],
})
export class AuthAuthorizationModule {}
