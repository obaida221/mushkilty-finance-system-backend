import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermission } from '../roles/entities/role-permission.entity';
import { Permission } from '../permissions/entities/permission.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([RolePermission, Permission])],
  exports: [TypeOrmModule],
})
export class SharedModule {}
