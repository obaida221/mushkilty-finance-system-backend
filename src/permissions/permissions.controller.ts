// src/permissions/permissions.controller.ts
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
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

  @Post('seed')
  @Permissions('permissions:update')
  async seed() {
    const base = [
      // Users & Auth
      'users:create',
      'users:read',
      'users:update',
      'users:delete',
      'roles:create',
      'roles:read',
      'roles:update',
      'roles:delete',
      'permissions:create',
      'permissions:read',
      'permissions:update',
      'permissions:delete',

      // Students
      'students:create',
      'students:read',
      'students:update',
      'students:delete',
      'students:search',

      // Courses
      'courses:create',
      'courses:read',
      'courses:update',
      'courses:delete',
      'courses:search',

      // Batches
      'batches:create',
      'batches:read',
      'batches:update',
      'batches:delete',
      'batches:search',

      // Enrollments
      'enrollments:create',
      'enrollments:read',
      'enrollments:update',
      'enrollments:delete',
      'enrollments:search',

      // Discount Codes
      'discount-codes:create',
      'discount-codes:read',
      'discount-codes:update',
      'discount-codes:delete',
      'discount-codes:validate',
      'discount-codes:search',

      // Payment Methods
      'payment-methods:create',
      'payment-methods:read',
      'payment-methods:update',
      'payment-methods:delete',
      'payment-methods:search',

      // Payments
      'payments:create',
      'payments:read',
      'payments:update',
      'payments:delete',
      'payments:search',
      'payments:reports',

      // Refunds
      'refunds:create',
      'refunds:read',
      'refunds:update',
      'refunds:delete',
      'refunds:search',
      'refunds:reports',

      // Expenses
      'expenses:create',
      'expenses:read',
      'expenses:update',
      'expenses:delete',
      'expenses:search',
      'expenses:reports',

      // Payroll
      'payrolls:create',
      'payrolls:read',
      'payrolls:update',
      'payrolls:delete',
      'payrolls:search',
      'payrolls:reports',

      // System
      'bootstrap:seed',
      'system:admin',
    ];

    const results: any[] = [];
    for (const name of base) {
      results.push(await this.service.ensure(name));
    }
    return { created: results.length };
  }
}
