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
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Enrollment> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['student', 'batch', 'batch.course']
    });
    
    if (!entity) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }
    
    return entity;
  }

  async update(id: number, updateDto: UpdateEnrollmentDto): Promise<Enrollment> {
    const entity = await this.findOne(id);
    await this.repository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.delete(id);
  }
}