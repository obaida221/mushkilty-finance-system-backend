// src/permissions/permissions.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { RolePermission } from '../roles/entities/role-permission.entity';
import { AuthAuthorizationModule } from '../auth/auth-authorization.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission, RolePermission]),
    AuthAuthorizationModule,
  ],
  providers: [PermissionsService],
  controllers: [PermissionsController],
  exports: [PermissionsService],
})
export class PermissionsModule {}
