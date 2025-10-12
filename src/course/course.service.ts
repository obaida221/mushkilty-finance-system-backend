import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private repository: Repository<Course>,
  ) {}

  async create(createDto: CreateCourseDto): Promise<Course> {
    const entity = this.repository.create(createDto);
    return this.repository.save(entity);
  }

  async findAll(): Promise<Course[]> {
    return this.repository.find({
      relations: ['user', 'batches'],
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Course> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['user', 'batches']
    });
    
    if (!entity) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    
    return entity;
  }

  async update(id: number, updateDto: UpdateCourseDto): Promise<Course> {
    const entity = await this.findOne(id);
    await this.repository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    
    // Check for related batches
    const batchesCount = await this.repository
      .createQueryBuilder('course')
      .leftJoin('course.batches', 'batch')
      .select('COUNT(batch.id)', 'count')
      .where('course.id = :id', { id })
      .getRawOne();

    if (parseInt(batchesCount.count) > 0) {
      throw new BadRequestException(
        `Cannot delete course. There are ${batchesCount.count} batch(es) associated with this course. Please remove all batches first.`
      );
    }

    await this.repository.delete(id);
  }

  // Dashboard specific methods
  async getCourseDistribution(): Promise<Array<{name: string, value: number, color: string}>> {
    const colors = {
      'online': '#DC2626',
      'onsite': '#F59E0B',
      'kids': '#10B981',
      'ielts': '#3B82F6',
    };

    const arabicNames = {
      'online': 'أونلاين',
      'onsite': 'حضوري',
      'kids': 'كيدز',
      'ielts': 'آيلتس',
    };

    const distribution = await this.repository
      .createQueryBuilder('course')
      .select('course.project_type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('course.project_type IS NOT NULL')
      .groupBy('course.project_type')
      .getRawMany();

    return distribution.map(item => ({
      name: arabicNames[item.type] || item.type,
      value: parseInt(item.count),
      color: colors[item.type] || '#6B7280',
    }));
  }
}