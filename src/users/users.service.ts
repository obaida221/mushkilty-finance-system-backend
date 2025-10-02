import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findAll(): Promise<User[]> {
    return this.repo.find({ relations: ['role'] });
  }

  findOne(id: number): Promise<User | null> {
    return this.repo.findOne({ where: { id }, relations: ['role'] });
  }

  async create(data: CreateUserDto): Promise<User> {
    // Handle password hashing if raw password is provided
    let password_hash = data.password_hash;
    if (data.password && !data.password_hash) {
      password_hash = await bcrypt.hash(data.password, 10);
    }

    const user = this.repo.create({
      ...data,
      password_hash,
    });

    return this.repo.save(user);
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    // Handle password hashing if raw password is provided
    const updateData: any = { ...data };
    if (data.password && !data.password_hash) {
      updateData.password_hash = await bcrypt.hash(data.password, 10);
      delete updateData.password; // Remove raw password from update data
    }

    return this.repo.save({ id, ...updateData });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email }, relations: ['role'] });
  }

  async findByEmailWithRole(email: string): Promise<User | null> {
    return this.repo.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
