import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Payroll } from './entities/payroll.entity';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Payroll)
    private repository: Repository<Payroll>,
  ) {}

  async create(createDto: CreatePayrollDto): Promise<Payroll> {
    const entity = this.repository.create(createDto);
    return this.repository.save(entity);
  }

  async findAll(): Promise<Payroll[]> {
    return this.repository.find({
      relations: ['user'],
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Payroll> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['user']
    });
    
    if (!entity) {
      throw new NotFoundException(`Payroll with ID ${id} not found`);
    }
    
    return entity;
  }

  async update(id: number, updateDto: UpdatePayrollDto): Promise<Payroll> {
    const entity = await this.findOne(id);
    await this.repository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.delete(id);
  }

  async findByUser(userId: number): Promise<Payroll[]> {
    return this.repository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' }
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Payroll[]> {
    return this.repository.find({
      where: {
        created_at: Between(startDate, endDate)
      },
      relations: ['user'],
      order: { created_at: 'DESC' }
    });
  }

  async findByPayPeriod(startDate: Date, endDate: Date): Promise<Payroll[]> {
    return this.repository
      .createQueryBuilder('payroll')
      .leftJoinAndSelect('payroll.user', 'user')
      .where('payroll.period_start = :startDate', { startDate })
      .andWhere('payroll.period_end = :endDate', { endDate })
      .orderBy('payroll.created_at', 'DESC')
      .getMany();
  }

  async getTotalPayrollByUser(userId: number): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('payroll')
      .select('SUM(payroll.amount)', 'total')
      .where('payroll.user_id = :userId', { userId })
      .getRawOne();
    
    return parseFloat(result.total) || 0;
  }

  async getTotalPayrollByDateRange(startDate: Date, endDate: Date): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('payroll')
      .select('SUM(payroll.amount)', 'total')
      .where('payroll.created_at BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();
    
    return parseFloat(result.total) || 0;
  }
}