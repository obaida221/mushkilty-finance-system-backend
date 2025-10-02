import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from 'src/transactions/dto/update-transaction.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly repo: Repository<Transaction>,
  ) {}

  async create(data: CreateTransactionDto) {
    const transaction = this.repo.create({
      ...data,
      user: { id: data.userId } as User,
    });
    return this.repo.save(transaction);
  }

  async findAll() {
    return this.repo.find({ relations: ['user'] });
  }

  async findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['user'] });
  }

  async update(id: number, data: UpdateTransactionDto) {
    return this.repo.save({ id, ...data });
  }

  async remove(id: number) {
    return this.repo.delete(id);
  }
}
