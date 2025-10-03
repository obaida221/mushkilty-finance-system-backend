import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { BootstrapModule } from './bootstrap/bootstrap.module';
import { SharedModule } from './shared/shared.module';
import { StudentModule } from './student/student.module';
import { CourseModule } from './course/course.module';
import { BatchModule } from './batch/batch.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { DiscountCodeModule } from './discount-code/discount-code.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { PaymentModule } from './payment/payment.module';
import { RefundModule } from './refund/refund.module';
import { ExpenseModule } from './expense/expense.module';
import { PayrollModule } from './payroll/payroll.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    SharedModule,
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    BootstrapModule,
    StudentModule,
    CourseModule,
    BatchModule,
    EnrollmentModule,
    DiscountCodeModule,
    PaymentMethodModule,
    PaymentModule,
    RefundModule,
    ExpenseModule,
    PayrollModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
