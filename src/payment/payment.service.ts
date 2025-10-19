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
      relations: ['enrollment', 'enrollment.student', 'paymentMethod', 'user'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Payment> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['enrollment', 'enrollment.student', 'paymentMethod', 'user'],
    });

    if (!entity) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return entity;
  }

  async update(id: number, updateDto: UpdatePaymentDto): Promise<Payment> {
    const entity = await this.findOne(id);

    if (!entity) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    await this.repository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);

    if (!entity) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    await this.repository.delete(id);
  }

  // Dashboard specific methods
  async getTotalByDateRange(startDate: Date, endDate: Date): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.paid_at BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })
      .getRawOne();

    return parseFloat(result?.total || 0);
  }

  async getTotalByMonth(year: number, month: number): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('EXTRACT(YEAR FROM payment.paid_at) = :year', { year })
      .andWhere('EXTRACT(MONTH FROM payment.paid_at) = :month', { month })
      .getRawOne();

    return parseFloat(result?.total || 0);
  }

  async getRevenueChartData(
    months: number = 6,
  ): Promise<Array<{ month: string; income: number }>> {
    const monthNames = [
      'يناير',
      'فبراير',
      'مارس',
      'أبريل',
      'مايو',
      'يونيو',
      'يوليو',
      'أغسطس',
      'سبتمبر',
      'أكتوبر',
      'نوفمبر',
      'ديسمبر',
    ];

    const result: Array<{ month: string; income: number }> = [];
    const currentDate = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1,
      );
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const income = await this.getTotalByMonth(year, month);

      result.push({
        month: monthNames[date.getMonth()],
        income,
      });
    }

    return result;
  }

  async getPaymentMethodDistribution(
    months: number = 6,
  ): Promise<Array<{ method: string; amount: number }>> {
    const arabicNames = {
      cash: 'نقدي',
      card: 'ماستر',
      transfer: 'زين كاش',
      bank: 'آسيا حوالة',
    };

    const currentDate = new Date();
    const fromDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - months + 1,
      1,
    );

    const paymentMethods = await this.repository
      .createQueryBuilder('payment')
      .leftJoin('payment.paymentMethod', 'paymentMethod')
      .select('paymentMethod.name', 'method')
      .addSelect('SUM(payment.amount)', 'total')
      .where('payment.paid_at >= :fromDate', { fromDate })
      .groupBy('paymentMethod.name')
      .orderBy('total', 'DESC')
      .getRawMany();

    return paymentMethods.map((item) => ({
      method: arabicNames[item.method] || item.method || 'غير محدد',
      amount: parseFloat(item.total || 0),
    }));
  }

  async getRecentPayments(limit: number = 5): Promise<Payment[]> {
    return this.repository.find({
      relations: ['enrollment', 'enrollment.student', 'paymentMethod'],
      order: { paid_at: 'DESC' },
      take: limit,
    });
  }
}
