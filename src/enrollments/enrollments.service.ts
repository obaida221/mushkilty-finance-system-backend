import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update.enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly repo: Repository<Enrollment>,
  ) {}

  create(data: CreateEnrollmentDto) {
    return this.repo.save(data);
  }

  findAll() {
    return this.repo.find({
      relations: ['student', 'batch', 'discountCode', 'user'],
    });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['student', 'batch', 'discountCode', 'user'],
    });
  }

  update(id: number, data: UpdateEnrollmentDto) {
    return this.repo.save({ id, ...data });
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
