import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
      relations: ['user', 'user.role'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Payroll> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['user', 'user.role'],
    });

    if (!entity) {
      throw new NotFoundException(`Payroll with ID ${id} not found`);
    }

    return entity;
  }

  async update(id: number, updateDto: UpdatePayrollDto): Promise<Payroll> {
    const entity = await this.findOne(id);

    if (!entity) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    await this.repository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);

    if (!entity) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    await this.repository.delete(id);
  }
}
