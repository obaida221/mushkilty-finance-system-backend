import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BootstrapService } from './bootstrap.service';
import { BootstrapController } from './bootstrap.controller';
import { Permission } from '../permissions/entities/permission.entity';
import { Role } from '../roles/entities/role.entity';
import { RolePermission } from '../roles/entities/role-permission.entity';
import { User } from '../users/entities/user.entity';
import { Student } from '../student/entities/student.entity';
import { Course } from '../course/entities/course.entity';
import { Batch } from '../batch/entities/batch.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { DiscountCode } from '../discount-code/entities/discount-code.entity';
import { PaymentMethod } from '../payment-method/entities/payment-method.entity';
import { Payment } from '../payment/entities/payment.entity';
import { Refund } from '../refund/entities/refund.entity';
import { Expense } from '../expense/entities/expense.entity';
import { Payroll } from '../payroll/entities/payroll.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Permission,
      Role,
      RolePermission,
      User,
      Student,
      Course,
      Batch,
      Enrollment,
      DiscountCode,
      PaymentMethod,
      Payment,
      Refund,
      Expense,
      Payroll,
    ])
  ],
  providers: [BootstrapService],
  controllers: [BootstrapController],
})
export class BootstrapModule {}
