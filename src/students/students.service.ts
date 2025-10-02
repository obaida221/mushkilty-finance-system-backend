import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly repo: Repository<Student>,
  ) {}

  create(data: CreateStudentDto) {
    const student = this.repo.create({
      ...data,
      user: { id: data.userId } as User,
    });
    return this.repo.save(student);
  }

  findAll() {
    return this.repo.find({ relations: ['user', 'enrollments'] });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['user', 'enrollments'],
    });
  }

  update(id: number, data: UpdateStudentDto) {
    return this.repo.save({ id, ...data });
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
