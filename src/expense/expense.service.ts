import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private repository: Repository<Expense>,
  ) {}

  async create(createDto: CreateExpenseDto): Promise<Expense> {
    const entity = this.repository.create(createDto);
    return this.repository.save(entity);
  }

  async findAll(): Promise<Expense[]> {
    return this.repository.find({
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Expense> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!entity) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return entity;
  }

  async update(id: number, updateDto: UpdateExpenseDto): Promise<Expense> {
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

  // Dashboard specific methods
  async getTotalByDateRange(startDate: Date, endDate: Date): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'total')
      .where('expense.expense_date BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })
      .getRawOne();

    return parseFloat(result?.total || 0);
  }

  async getTotalByMonth(year: number, month: number): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'total')
      .where('EXTRACT(YEAR FROM expense.expense_date) = :year', { year })
      .andWhere('EXTRACT(MONTH FROM expense.expense_date) = :month', { month })
      .getRawOne();

    return parseFloat(result?.total || 0);
  }

  async getExpenseChartData(
    months: number = 6,
  ): Promise<Array<{ month: string; expenses: number }>> {
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

    const result: Array<{ month: string; expenses: number }> = [];
    const currentDate = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1,
      );
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const expenses = await this.getTotalByMonth(year, month);

      result.push({
        month: monthNames[date.getMonth()],
        expenses,
      });
    }

    return result;
  }

  async getRecentExpenses(limit: number = 5): Promise<Expense[]> {
    return this.repository.find({
      relations: ['user'],
      order: { expense_date: 'DESC' },
      take: limit,
    });
  }
}
