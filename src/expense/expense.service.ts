import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
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
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Expense> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['user']
    });
    
    if (!entity) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
    
    return entity;
  }

  async update(id: number, updateDto: UpdateExpenseDto): Promise<Expense> {
    const entity = await this.findOne(id);
    await this.repository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.delete(id);
  }

  async findByUser(userId: number): Promise<Expense[]> {
    return this.repository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' }
    });
  }

  async findByCategory(category: string): Promise<Expense[]> {
    return this.repository.find({
      where: { category },
      relations: ['user'],
      order: { created_at: 'DESC' }
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Expense[]> {
    return this.repository.find({
      where: {
        created_at: Between(startDate, endDate)
      },
      relations: ['user'],
      order: { created_at: 'DESC' }
    });
  }

  async getTotalExpensesByUser(userId: number): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'total')
      .where('expense.user_id = :userId', { userId })
      .getRawOne();
    
    return parseFloat(result.total) || 0;
  }

  async getTotalExpensesByCategory(category: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'total')
      .where('expense.category = :category', { category })
      .getRawOne();
    
    return parseFloat(result.total) || 0;
  }

  async getTotalExpensesByDateRange(startDate: Date, endDate: Date): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'total')
      .where('expense.created_at BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();
    
    return parseFloat(result.total) || 0;
  }
}