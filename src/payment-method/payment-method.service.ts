import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethod } from './entities/payment-method.entity';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectRepository(PaymentMethod)
    private repository: Repository<PaymentMethod>,
  ) {}

  async create(createDto: CreatePaymentMethodDto): Promise<PaymentMethod> {
    const entity = this.repository.create(createDto);
    return this.repository.save(entity);
  }

  async findAll(): Promise<PaymentMethod[]> {
    return this.repository.find({
      relations: ['payments'],
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: number): Promise<PaymentMethod> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['payments']
    });
    
    if (!entity) {
      throw new NotFoundException(`PaymentMethod with ID ${id} not found`);
    }
    
    return entity;
  }

  async update(id: number, updateDto: UpdatePaymentMethodDto): Promise<PaymentMethod> {
    const entity = await this.findOne(id);
    await this.repository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.delete(id);
  }
}