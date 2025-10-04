import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Refund } from './entities/refund.entity';
import { CreateRefundDto } from './dto/create-refund.dto';
import { UpdateRefundDto } from './dto/update-refund.dto';

@Injectable()
export class RefundService {
  constructor(
    @InjectRepository(Refund)
    private repository: Repository<Refund>,
  ) {}

  async create(createDto: CreateRefundDto): Promise<Refund> {
    const entity = this.repository.create(createDto);
    return this.repository.save(entity);
  }

  async findAll(): Promise<Refund[]> {
    return this.repository.find({
      relations: ['payment', 'payment.enrollment', 'payment.enrollment.student'],
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Refund> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['payment', 'payment.enrollment', 'payment.enrollment.student']
    });
    
    if (!entity) {
      throw new NotFoundException(`Refund with ID ${id} not found`);
    }
    
    return entity;
  }

  async update(id: number, updateDto: UpdateRefundDto): Promise<Refund> {
    const entity = await this.findOne(id);
    await this.repository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.delete(id);
  }
}