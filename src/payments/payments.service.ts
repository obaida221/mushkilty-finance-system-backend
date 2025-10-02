import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly repo: Repository<Payment>,
  ) {}

  async create(data: CreatePaymentDto) {
    const payment = this.repo.create(data);
    return this.repo.save(payment);
  }

  async findAll() {
    return this.repo.find({
      relations: ['user', 'paymentMethod', 'enrollment', 'transaction'],
    });
  }

  async findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['user', 'paymentMethod', 'enrollment', 'transaction'],
    });
  }

  async update(id: number, data: UpdatePaymentDto) {
    return this.repo.save({ id, ...data });
  }

  async remove(id: number) {
    return this.repo.delete(id);
  }
}
