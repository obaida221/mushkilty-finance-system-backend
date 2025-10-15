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
import { PaymentMethod } from '../../payment-method/entities/payment-method.entity';
import { User } from '../../users/entities/user.entity';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';
import { Refund } from '../../refund/entities/refund.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  payment_method_id: number;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.payments)
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: PaymentMethod;

  @Column({ comment: 'ID of the user who recorded the payment' })
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  enrollment_id: number;

  @ManyToOne(() => Enrollment, (enrollment) => enrollment.payments)
  @JoinColumn({ name: 'enrollment_id' })
  enrollment: Enrollment;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'if enrollment_id is NULL then payer is NOT NULL',
  })
  payer: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
  amount: number;

  @Column({
    type: 'varchar',
    length: 10,
    default: 'IQD',
    comment: 'USD|IQD',
  })
  currency: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'installment|full',
  })
  type: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  paid_at: Date;

  @Column({ type: 'text', nullable: true, comment: 'image link' })
  payment_proof: string;

  @OneToMany(() => Refund, (refund) => refund.payment)
  refunds: Refund[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
