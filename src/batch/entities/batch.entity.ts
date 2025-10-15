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
import { Course } from '../../course/entities/course.entity';
import { User } from '../../users/entities/user.entity';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';

@Entity('batches')
export class Batch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  course_id: number;

  @ManyToOne(() => Course, (course) => course.batches)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column()
  trainer_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'trainer_id' })
  trainer: User;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
    comment: 'A1, A2, B1, B2, C1',
  })
  level: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'date', nullable: true })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'every monday, wednesday, friday at 3pm',
  })
  schedule: string;

  @Column({ type: 'int', nullable: true })
  capacity: number;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'open',
    comment: 'open, closed, full',
  })
  status: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  actual_price: number;

  @Column({
    type: 'varchar',
    length: 10,
    default: 'IQD',
    comment: 'USD|IQD',
  })
  currency: string;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.batch)
  enrollments: Enrollment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
