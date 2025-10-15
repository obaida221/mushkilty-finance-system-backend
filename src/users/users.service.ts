import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findOne(id: number): Promise<User> {
    const user = await this.repo.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException(`user with id: ${id} not found`);
    }

    return user;
  }

  async create(data: CreateUserDto): Promise<User> {
    const existingUserEmail = await this.repo.findOne({
      where: { email: data.email },
    });
    if (existingUserEmail) {
      throw new ConflictException('Email already exist!');
    }
    const existingUserName = await this.repo.findOne({
      where: { name: data.name },
    });
    if (existingUserName) {
      throw new ConflictException('The name of the user already exist!');
    }
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
    const user = await this.findOne(id); // Ensure user exists
    if (!user) {
      throw new NotFoundException(`user with id: ${id} not found`);
    }
    // Handle password hashing if raw password is provided
    const updateData: any = { ...data };
    if (data.password && !data.password_hash) {
      updateData.password_hash = await bcrypt.hash(data.password, 10);
      delete updateData.password; // Remove raw password from update data
    }

    return this.repo.save({ id, ...updateData });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repo.findOne({
      where: { email },
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException(`user with email: ${email} not found`);
    }
    return user;
  }

  async remove(id: number): Promise<void> {
    const user = await this.repo.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException(`user with id: ${id} not found`);
    }

    await this.repo.delete(id);
  }
}
