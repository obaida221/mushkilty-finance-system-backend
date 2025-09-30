import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermission } from '../roles/entities/role-permission.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { PermissionsGuard } from './guards/permissions.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([RolePermission, Permission])],
  providers: [PermissionsGuard, JwtAuthGuard],
  exports: [PermissionsGuard, JwtAuthGuard],
})
export class AuthAuthorizationModule {}