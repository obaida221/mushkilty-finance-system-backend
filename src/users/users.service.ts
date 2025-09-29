import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findAll(): Promise<User[]> {
    return this.repo.find({ relations: ['role'] });
  }

  findOne(id: number): Promise<User | null> {
    return this.repo.findOne({ where: { id }, relations: ['role'] });
  }

  create(data: CreateUserDto): Promise<User> {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  update(id: number, data: UpdateUserDto): Promise<User> {
    return this.repo.save({ id, ...data });
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email }, relations: ['role'] });
  }
  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
