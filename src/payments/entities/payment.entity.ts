import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentMethod } from 'src/payment-methods/entities/payment-method.entity';
import { User } from 'src/users/entities/user.entity';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PaymentMethod)
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: PaymentMethod;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Enrollment, { nullable: true })
  @JoinColumn({ name: 'enrollment_id' })
  enrollment: Enrollment;

  @Column({ nullable: true })
  payer: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column({ default: 'IQD' })
  currency: string;

  @Column()
  type: string;

  @Column({
    name: 'paid_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  paidAt: Date;

  @Column({ name: 'payment_proof', type: 'text', nullable: true })
  paymentProof: string;

  @ManyToOne(() => Transaction, { nullable: true })
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
