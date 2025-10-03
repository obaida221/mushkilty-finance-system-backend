import { Injectable, NotFoundException } from '@nestjs/common';
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
    await this.repository.delete(id);
  }

  async findByProjectType(projectType: string): Promise<Course[]> {
    return this.repository.find({
      where: { project_type: projectType },
      relations: ['user'],
      order: { created_at: 'DESC' }
    });
  }

  async findByUser(userId: number): Promise<Course[]> {
    return this.repository.find({
      where: { user_id: userId },
      relations: ['batches'],
      order: { created_at: 'DESC' }
    });
  }
}