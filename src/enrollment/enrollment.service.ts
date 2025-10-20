import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private repository: Repository<Enrollment>,
  ) {}

  async create(createDto: CreateEnrollmentDto): Promise<Enrollment> {
    const entity = this.repository.create(createDto);
    return this.repository.save(entity);
  }

  async findAll(): Promise<Enrollment[]> {
    return this.repository.find({
      relations: ['student', 'batch', 'batch.course'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Enrollment> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['student', 'batch', 'batch.course'],
    });

    if (!entity) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }

    return entity;
  }

  async update(
    id: number,
    updateDto: UpdateEnrollmentDto,
  ): Promise<Enrollment> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }
    await this.repository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }
    await this.repository.delete(id);
  }

  // Dashboard specific methods
  async getActiveStudentsCount(): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('enrollment')
      .select('COUNT(DISTINCT enrollment.student_id)', 'count')
      .where('enrollment.status IN (:...statuses)', {
        statuses: ['pending', 'accepted'],
      })
      .getRawOne();

    return parseInt(result?.count || 0);
  }

  async getActiveStudentsCountByMonth(
    year: number,
    month: number,
  ): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('enrollment')
      .select('COUNT(DISTINCT enrollment.student_id)', 'count')
      .where('enrollment.status IN (:...statuses)', {
        statuses: ['pending', 'accepted'],
      })
      .andWhere('EXTRACT(YEAR FROM enrollment.enrolled_at) = :year', { year })
      .andWhere('EXTRACT(MONTH FROM enrollment.enrolled_at) = :month', {
        month,
      })
      .getRawOne();

    return parseInt(result?.count || 0);
  }

  async getEnrollmentChartData(
    months: number = 6,
  ): Promise<Array<{ month: string; students: number }>> {
    const monthNames = [
      'يناير',
      'فبراير',
      'مارس',
      'أبريل',
      'مايو',
      'يونيو',
      'يوليو',
      'أغسطس',
      'سبتمبر',
      'أكتوبر',
      'نوفمبر',
      'ديسمبر',
    ];

    const result: Array<{ month: string; students: number }> = [];
    const currentDate = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1,
      );
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const enrollments = await this.repository
        .createQueryBuilder('enrollment')
        .select('COUNT(*)', 'count')
        .where('EXTRACT(YEAR FROM enrollment.enrolled_at) = :year', { year })
        .andWhere('EXTRACT(MONTH FROM enrollment.enrolled_at) = :month', {
          month,
        })
        .getRawOne();

      result.push({
        month: monthNames[date.getMonth()],
        students: parseInt(enrollments?.count || 0),
      });
    }

    return result;
  }

  async getRecentEnrollments(limit: number = 5): Promise<Enrollment[]> {
    return this.repository.find({
      relations: ['student', 'batch', 'batch.course'],
      order: { enrolled_at: 'DESC' },
      take: limit,
    });
  }
}
