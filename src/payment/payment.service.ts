import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private repository: Repository<Payment>,
  ) {}

  async create(createDto: CreatePaymentDto): Promise<Payment> {
    const entity = this.repository.create(createDto);
    return this.repository.save(entity);
  }

  async findAll(): Promise<Payment[]> {
    return this.repository.find({
      relations: ['enrollment', 'enrollment.student', 'paymentMethod'],
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Payment> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['enrollment', 'enrollment.student', 'paymentMethod']
    });
    
    if (!entity) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    
    return entity;
  }

  async update(id: number, updateDto: UpdatePaymentDto): Promise<Payment> {
    const entity = await this.findOne(id);
    await this.repository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.delete(id);
  }
}