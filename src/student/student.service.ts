import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private repository: Repository<Student>,
  ) {}

  async create(createDto: CreateStudentDto): Promise<Student> {
    const entity = this.repository.create(createDto);
    return this.repository.save(entity);
  }

  async findAll(): Promise<Student[]> {
    return this.repository.find({
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Student> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['enrollments']
    });
    
    if (!entity) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    
    return entity;
  }

  async update(id: number, updateDto: UpdateStudentDto): Promise<Student> {
    const entity = await this.findOne(id);
    await this.repository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.delete(id);
  }

  async findByPhone(phone: string): Promise<Student | null> {
    return this.repository.findOne({ where: { phone } });
  }

  async findByStatus(status: string): Promise<Student[]> {
    return this.repository.find({ 
      where: { status },
      order: { created_at: 'DESC' }
    });
  }
}