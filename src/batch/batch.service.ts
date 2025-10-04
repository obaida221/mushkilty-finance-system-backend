import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Batch } from './entities/batch.entity';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';

@Injectable()
export class BatchService {
  constructor(
    @InjectRepository(Batch)
    private repository: Repository<Batch>,
  ) {}

  async create(createDto: CreateBatchDto): Promise<Batch> {
    const entity = this.repository.create(createDto);
    return this.repository.save(entity);
  }

  async findAll(): Promise<Batch[]> {
    return this.repository.find({
      relations: ['course', 'enrollments'],
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Batch> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['course', 'enrollments']
    });
    
    if (!entity) {
      throw new NotFoundException(`Batch with ID ${id} not found`);
    }
    
    return entity;
  }

  async update(id: number, updateDto: UpdateBatchDto): Promise<Batch> {
    const entity = await this.findOne(id);
    await this.repository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.delete(id);
  }
}