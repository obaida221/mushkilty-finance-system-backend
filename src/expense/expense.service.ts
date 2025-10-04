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
}