import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../student/entities/student.entity';
import { Batch } from '../../batch/entities/batch.entity';
import { DiscountCode } from '../../discount-code/entities/discount-code.entity';
import { User } from '../../users/entities/user.entity';
import { Payment } from '../../payment/entities/payment.entity';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  student_id: number;

  @ManyToOne(() => Student, (student) => student.enrollments)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column()
  batch_id: number;

  @ManyToOne(() => Batch, (batch) => batch.enrollments)
  @JoinColumn({ name: 'batch_id' })
  batch: Batch;

  @Column({ type: 'varchar', length: 100, nullable: true })
  discount_code: string;

  @ManyToOne(() => DiscountCode)
  @JoinColumn({ name: 'discount_code', referencedColumnName: 'code' })
  discountCodeEntity: DiscountCode;

  @Column()
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  total_price: number;

  @Column({ 
    type: 'varchar', 
    length: 10, 
    default: 'IQD',
    comment: 'USD|IQD'
  })
  currency: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  enrolled_at: Date;

  @Column({ 
    type: 'varchar', 
    length: 50, 
    default: 'pending',
    comment: 'pending, accepted, dropped, completed'
  })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => Payment, (payment) => payment.enrollment)
  payments: Payment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
