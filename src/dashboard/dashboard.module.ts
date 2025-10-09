import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Payment } from '../payment/entities/payment.entity';
import { Expense } from '../expense/entities/expense.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { Course } from '../course/entities/course.entity';
import { Student } from '../student/entities/student.entity';
import { PaymentMethod } from '../payment-method/entities/payment-method.entity';
import { AuthAuthorizationModule } from '../auth/auth-authorization.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment,
      Expense,
      Enrollment,
      Course,
      Student,
      PaymentMethod,
    ]),
    AuthAuthorizationModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}