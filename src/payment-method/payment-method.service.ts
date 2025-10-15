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
    const existing = await this.repository.findOne({
      where: { name: createDto.name },
    });
    if (existing) {
      throw new NotFoundException(
        `PaymentMethod with name ${createDto.name} already exists`,
      );
    }
    return this.repository.save(entity);
  }

  async findAll(): Promise<PaymentMethod[]> {
    return this.repository.find({
      relations: ['user', 'payments'],
      order: { created_at: 'ASC' },
    });
  }

  async findOne(id: number): Promise<PaymentMethod> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['user', 'payments'],
    });

    if (!entity) {
      throw new NotFoundException(`PaymentMethod with ID ${id} not found`);
    }

    return entity;
  }

  async update(
    id: number,
    updateDto: UpdatePaymentMethodDto,
  ): Promise<PaymentMethod> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new NotFoundException(`PaymentMethod with ID ${id} not found`);
    }
    await this.repository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new NotFoundException(`PaymentMethod with ID ${id} not found`);
    }
    await this.repository.delete(id);
  }
}
