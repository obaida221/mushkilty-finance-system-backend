import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PaymentModule } from '../payment/payment.module';
import { ExpenseModule } from '../expense/expense.module';
import { EnrollmentModule } from '../enrollment/enrollment.module';
import { CourseModule } from '../course/course.module';
import { StudentModule } from '../student/student.module';
import { PaymentMethodModule } from '../payment-method/payment-method.module';
import { AuthAuthorizationModule } from '../auth/auth-authorization.module';

@Module({
  imports: [
    PaymentModule,
    ExpenseModule,
    EnrollmentModule,
    CourseModule,
    StudentModule,
    PaymentMethodModule,
    AuthAuthorizationModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
