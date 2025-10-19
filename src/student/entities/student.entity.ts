import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  full_name: string;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ type: 'date', nullable: true })
  dob: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  education_level: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  gender: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  area: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'online|onsite|kids|ielts',
  })
  course_type: string;

  @Column({ type: 'text', nullable: true, comment: 'if any' })
  previous_course: string;

  @Column({ type: 'boolean', default: false })
  is_returning: boolean;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'pending',
    comment: 'pending, contacted with, tested, accepted, rejected',
  })
  status: string;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
