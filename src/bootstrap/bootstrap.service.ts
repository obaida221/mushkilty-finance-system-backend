import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
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
import * as bcrypt from 'bcrypt';

@Injectable()
export class BootstrapService {
  constructor(
    @InjectRepository(Permission) private permRepo: Repository<Permission>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(RolePermission) private rpRepo: Repository<RolePermission>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @InjectRepository(Batch) private batchRepo: Repository<Batch>,
    @InjectRepository(Enrollment) private enrollmentRepo: Repository<Enrollment>,
    @InjectRepository(DiscountCode) private discountRepo: Repository<DiscountCode>,
    @InjectRepository(PaymentMethod) private paymentMethodRepo: Repository<PaymentMethod>,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(Refund) private refundRepo: Repository<Refund>,
    @InjectRepository(Expense) private expenseRepo: Repository<Expense>,
    @InjectRepository(Payroll) private payrollRepo: Repository<Payroll>,
  ) {}

  async run() {
    try {
      console.log('🚀 Starting bootstrap seeding...');
      
      // Seed permissions
      console.log('📝 Seeding permissions...');
      const permissions = [
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
        
        // Courses
        'courses:create',
        'courses:read',
        'courses:update',
        'courses:delete',
        
        // Batches
        'batches:create',
        'batches:read',
        'batches:update',
        'batches:delete',
        
        // Enrollments
        'enrollments:create',
        'enrollments:read',
        'enrollments:update',
        'enrollments:delete',
        
        // Discount Codes
        'discount-codes:create',
        'discount-codes:read',
        'discount-codes:update',
        'discount-codes:delete',
        
        // Payment Methods
        'payment-methods:create',
        'payment-methods:read',
        'payment-methods:update',
        'payment-methods:delete',
        
        // Payments
        'payments:create',
        'payments:read',
        'payments:update',
        'payments:delete',
        
        // Refunds
        'refunds:create',
        'refunds:read',
        'refunds:update',
        'refunds:delete',
        
        // Expenses
        'expenses:create',
        'expenses:read',
        'expenses:update',
        'expenses:delete',
        
        // Payroll
        'payrolls:create',
        'payrolls:read',
        'payrolls:update',
        'payrolls:delete',
        
        // Dashboard
        'dashboard:read',
        'dashboard:analytics',
        
        // System
        'bootstrap:seed',
        'system:admin',
      ];

      const existingPerms = await this.permRepo.find({ where: { name: In(permissions) } });
      const existingSet = new Set(existingPerms.map((p) => p.name));
      const toCreate = permissions
        .filter((name) => !existingSet.has(name))
        .map((name) => this.permRepo.create({ name }));
      if (toCreate.length) {
        await this.permRepo.save(toCreate);
        console.log(`✅ Created ${toCreate.length} permissions`);
      } else {
        console.log('✅ All permissions already exist');
      }

      const allPerms = await this.permRepo.find({ where: { name: In(permissions) } });

      // Seed roles
      console.log('👥 Seeding roles...');
      const roles = [
        { name: 'admin', description: 'Full system access' },
        { name: 'accountant', description: 'Manage payments, expenses, and payroll' },
        { name: 'instructor', description: 'Manage courses, batches, and students' },
        { name: 'student_advisor', description: 'Manage students and enrollments' },
        { name: 'finance_manager', description: 'View reports and manage discounts' },
        { name: 'viewer', description: 'Read-only access' },
      ];
      
      const existingRoles = await this.roleRepo.find();
      const roleNames = new Set(existingRoles.map((r) => r.name));
      const rolesToCreate = roles
        .filter((r) => !roleNames.has(r.name))
        .map((r) => this.roleRepo.create(r));
      if (rolesToCreate.length) {
        await this.roleRepo.save(rolesToCreate);
        console.log(`✅ Created ${rolesToCreate.length} roles`);
      } else {
        console.log('✅ All roles already exist');
      }

      const admin = await this.roleRepo.findOne({ where: { name: 'admin' } });
      if (admin) {
        // Assign all permissions to admin
        console.log('🔑 Assigning permissions to admin role...');
        const existingRps = await this.rpRepo.find({ where: { role_id: admin.id } });
        const permIdSet = new Set(existingRps.map((rp) => rp.permission_id));
        const rpsToCreate = allPerms
          .filter((p) => !permIdSet.has(p.id))
          .map((p) => this.rpRepo.create({ role_id: admin.id, permission_id: p.id }));
        if (rpsToCreate.length) {
          await this.rpRepo.save(rpsToCreate);
          console.log(`✅ Assigned ${rpsToCreate.length} permissions to admin`);
        } else {
          console.log('✅ Admin already has all permissions');
        }
      }

      // Seed admin user if none exists
      console.log('👤 Seeding admin user...');
      const anyUser = await this.userRepo.findOne({ where: { email: 'admin@example.com' } });
      if (!anyUser && admin) {
        const password_hash = await bcrypt.hash('Admin@123', 10);
        await this.userRepo.save(
          this.userRepo.create({
            email: 'admin@example.com',
            name: 'Bootstrap Admin',
            password_hash,
            role_id: admin.id,
          }),
        );
        console.log('✅ Created admin user');
      } else {
        console.log('✅ Admin user already exists');
      }

      // Seed sample data
      console.log('📊 Skipping sample data seeding to avoid dependency issues');
      // await this.seedSampleData();

      console.log('🎉 Bootstrap seeding completed successfully!');
      console.log('');
      console.log('📊 Summary:');
      console.log(`  - ${permissions.length} permissions available`);
      console.log(`  - ${roles.length} roles configured`);
      console.log('  - Admin user ready: admin@example.com / Admin@123');
      console.log('');
      console.log('🚀 You can now:');
      console.log('  1. Login with admin credentials');
      console.log('  2. Create additional users and assign roles');
      console.log('  3. Start using the API endpoints');
      console.log('  4. Create courses, batches, students, and other data through the API');
      
      return { ok: true, message: 'Database seeded successfully' };
    } catch (error) {
      console.error('❌ Bootstrap seeding failed:', error);
      throw error;
    }
  }

  private async seedSampleData() {
    try {
      // Get admin user first (needed for payment methods and courses)
      console.log('� Finding admin user for data creation...');
      const adminUser = await this.userRepo.findOne({ where: { email: 'admin@example.com' } });
      if (!adminUser) {
        console.log('⚠️ Admin user not found, skipping sample data seeding');
        return;
      }
      console.log('✅ Admin user found');

      console.log('�💳 Seeding payment methods...');
      // Seed Payment Methods (now with user_id)
      const paymentMethods = [
        { user_id: adminUser.id, name: 'cash', description: 'Cash payment', is_valid: true },
        { user_id: adminUser.id, name: 'transfer', description: 'Bank transfer payment', is_valid: true },
        { user_id: adminUser.id, name: 'card', description: 'Credit card payment', is_valid: true },
        { user_id: adminUser.id, name: 'card', description: 'PayPal payment', method_number: 'paypal', is_valid: true },
      ];

      for (const method of paymentMethods) {
        const existing = await this.paymentMethodRepo.findOne({ 
          where: { 
            name: method.name, 
            user_id: method.user_id,
            ...(method.method_number && { method_number: method.method_number })
          } 
        });
        if (!existing) {
          await this.paymentMethodRepo.save(this.paymentMethodRepo.create(method));
        }
      }
      console.log('✅ Payment methods seeded');

      // Get admin user for course creation
      console.log('� Seeding courses...');

      console.log('📚 Seeding courses...');
      // Seed Courses
      const courses = [
        {
          user_id: adminUser.id,
          name: 'Web Development Fundamentals',
          description: 'Learn HTML, CSS, and JavaScript basics',
          project_type: 'online',
        },
        {
          user_id: adminUser.id,
          name: 'React.js Development',
          description: 'Master React.js framework',
          project_type: 'online',
        },
        {
          user_id: adminUser.id,
          name: 'Node.js Backend Development',
          description: 'Build REST APIs with Node.js',
          project_type: 'online',
        },
        {
          user_id: adminUser.id,
          name: 'Kids Programming',
          description: 'Programming for kids',
          project_type: 'kids',
        },
      ];

      const createdCourses: Course[] = [];
      for (const course of courses) {
        const existing = await this.courseRepo.findOne({ where: { name: course.name } });
        if (!existing) {
          const created = await this.courseRepo.save(this.courseRepo.create(course));
          createdCourses.push(created);
        } else {
          createdCourses.push(existing);
        }
      }
      console.log(`✅ Seeded ${createdCourses.length} courses`);

      console.log('📝 Seeding batches...');
      // Seed Batches
      const batches = [
        {
          course_id: createdCourses[0]?.id,
          name: 'WEB-2025-Q1',
          description: 'Web Development Q1 2025 batch',
          start_date: new Date('2025-01-15'),
          end_date: new Date('2025-04-15'),
          capacity: 25,
          is_active: true,
        },
        {
          course_id: createdCourses[1]?.id,
          name: 'REACT-2025-Q1',
          description: 'React.js Q1 2025 batch',
          start_date: new Date('2025-02-01'),
          end_date: new Date('2025-04-01'),
          capacity: 20,
          is_active: true,
        },
        {
          course_id: createdCourses[2]?.id,
          name: 'NODE-2025-Q1',
          description: 'Node.js Q1 2025 batch',
          start_date: new Date('2025-02-15'),
          end_date: new Date('2025-05-15'),
          capacity: 20,
          is_active: true,
        },
      ];

      const createdBatches: Batch[] = [];
      for (const batch of batches) {
        if (batch.course_id) {
          const existing = await this.batchRepo.findOne({ where: { name: batch.name } });
          if (!existing) {
            const created = await this.batchRepo.save(this.batchRepo.create(batch));
            createdBatches.push(created);
          } else {
            createdBatches.push(existing);
          }
        }
      }
      console.log(`✅ Seeded ${createdBatches.length} batches`);

      console.log('🎟️ Seeding discount codes...');
      // Seed Discount Codes
      const discountCodes = [
        {
          code: 'WELCOME2025',
          description: 'Welcome discount for new students',
          discount_type: 'percentage',
          discount_value: 10.00,
          min_amount: 100.00,
          max_discount: 50.00,
          start_date: new Date('2025-01-01'),
          end_date: new Date('2025-12-31'),
          usage_limit: 100,
          usage_count: 0,
          is_active: true,
        },
        {
          code: 'EARLY50',
          description: 'Early bird discount',
          discount_type: 'fixed',
          discount_value: 50.00,
          min_amount: 200.00,
          start_date: new Date('2025-01-01'),
          end_date: new Date('2025-03-31'),
          usage_limit: 50,
          usage_count: 0,
          is_active: true,
        },
      ];

      for (const discount of discountCodes) {
        const existing = await this.discountRepo.findOne({ where: { code: discount.code } });
        if (!existing) {
          await this.discountRepo.save(this.discountRepo.create(discount));
        }
      }
      console.log('✅ Discount codes seeded');

      console.log('🎓 Seeding students...');
      // Seed Students
      const students = [
        {
          full_name: 'John Doe',
          age: 28,
          dob: new Date('1995-05-15'),
          education_level: 'Bachelor',
          gender: 'Male',
          phone: '+1234567890',
          city: 'New York',
          area: 'Manhattan',
          course_type: 'online',
          previous_course: undefined,
          is_returning: false,
          status: 'accepted',
        },
        {
          full_name: 'Alice Smith',
          age: 25,
          dob: new Date('1998-08-22'),
          education_level: 'Master',
          gender: 'Female',
          phone: '+1234567892',
          city: 'Los Angeles',
          area: 'Downtown',
          course_type: 'online',
          previous_course: undefined,
          is_returning: false,
          status: 'accepted',
        },
        {
          full_name: 'Mike Johnson',
          age: 26,
          dob: new Date('1997-03-10'),
          education_level: 'Bachelor',
          gender: 'Male',
          phone: '+1234567894',
          city: 'Chicago',
          area: 'North Side',
          course_type: 'online',
          previous_course: undefined,
          is_returning: false,
          status: 'accepted',
        },
      ];

      const createdStudents: Student[] = [];
      for (const student of students) {
        const existing = await this.studentRepo.findOne({ where: { phone: student.phone } });
        if (!existing) {
          const created = await this.studentRepo.save(this.studentRepo.create(student));
          createdStudents.push(created);
        } else {
          createdStudents.push(existing);
        }
      }
      console.log(`✅ Seeded ${createdStudents.length} students`);

      console.log('📋 Seeding enrollments...');
      // Seed Enrollments
      if (createdStudents.length > 0 && createdBatches.length > 0) {
        const enrollments = [
          {
            student_id: createdStudents[0]?.id,
            batch_id: createdBatches[0]?.id,
            enrollment_date: new Date('2025-01-10'),
            status: 'active',
            notes: 'Regular enrollment',
          },
          {
            student_id: createdStudents[1]?.id,
            batch_id: createdBatches[1]?.id,
            enrollment_date: new Date('2025-01-25'),
            status: 'active',
            notes: 'Early bird enrollment',
          },
          {
            student_id: createdStudents[2]?.id,
            batch_id: createdBatches[2]?.id,
            enrollment_date: new Date('2025-02-10'),
            status: 'active',
            notes: 'Scholarship student',
          },
        ];

        let enrollmentCount = 0;
        for (const enrollment of enrollments) {
          if (enrollment.student_id && enrollment.batch_id) {
            const existing = await this.enrollmentRepo.findOne({
              where: {
                student_id: enrollment.student_id,
                batch_id: enrollment.batch_id,
              },
            });
            if (!existing) {
              await this.enrollmentRepo.save(this.enrollmentRepo.create(enrollment));
              enrollmentCount++;
            }
          }
        }
        console.log(`✅ Seeded ${enrollmentCount} enrollments`);
      }

      console.log('👥 Seeding sample users...');
      // Create sample users for different roles
      const sampleUsers = [
        {
          email: 'accountant@example.com',
          name: 'Finance Manager',
          role: 'accountant',
          password: 'Accountant@123',
        },
        {
          email: 'instructor@example.com',
          name: 'Course Instructor',
          role: 'instructor',
          password: 'Instructor@123',
        },
        {
          email: 'advisor@example.com',
          name: 'Student Advisor',
          role: 'student_advisor',
          password: 'Advisor@123',
        },
      ];

      let userCount = 0;
      for (const userData of sampleUsers) {
        const existing = await this.userRepo.findOne({ where: { email: userData.email } });
        if (!existing) {
          const role = await this.roleRepo.findOne({ where: { name: userData.role } });
          if (role) {
            const password_hash = await bcrypt.hash(userData.password, 10);
            await this.userRepo.save(
              this.userRepo.create({
                email: userData.email,
                name: userData.name,
                password_hash,
                role_id: role.id,
              }),
            );
            userCount++;
          }
        }
      }
      console.log(`✅ Seeded ${userCount} sample users`);

      console.log('✅ Sample data seeded successfully');
    } catch (error) {
      console.error('❌ Error seeding sample data:', error);
      throw error;
    }
  }
}
