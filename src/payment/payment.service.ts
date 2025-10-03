import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
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

  async findByStudent(studentId: number): Promise<Payment[]> {
    return this.repository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.enrollment', 'enrollment')
      .leftJoinAndSelect('enrollment.student', 'student')
      .leftJoinAndSelect('payment.paymentMethod', 'paymentMethod')
      .where('enrollment.student_id = :studentId', { studentId })
      .orderBy('payment.created_at', 'DESC')
      .getMany();
  }

  async findByPaymentMethod(paymentMethodId: number): Promise<Payment[]> {
    return this.repository.find({
      where: { payment_method_id: paymentMethodId },
      relations: ['enrollment', 'enrollment.student'],
      order: { created_at: 'DESC' }
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Payment[]> {
    return this.repository.find({
      where: {
        created_at: Between(startDate, endDate)
      },
      relations: ['enrollment', 'enrollment.student', 'paymentMethod'],
      order: { created_at: 'DESC' }
    });
  }

  async getTotalPaymentsByStudent(studentId: number): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('payment')
      .leftJoin('payment.enrollment', 'enrollment')
      .select('SUM(payment.amount)', 'total')
      .where('enrollment.student_id = :studentId', { studentId })
      .getRawOne();
    
    return parseFloat(result.total) || 0;
  }

  async getTotalPaymentsByDateRange(startDate: Date, endDate: Date): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.created_at BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();
    
    return parseFloat(result.total) || 0;
  }
}