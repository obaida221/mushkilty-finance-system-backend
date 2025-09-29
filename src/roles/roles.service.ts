import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private repo: Repository<Role>) {}

  findAll(): Promise<Role[]> {
    return this.repo.find();
  }

  findOne(id: number): Promise<Role | null> {
    return this.repo.findOne({ where: { id } });
  }

  create(data: CreateRoleDto): Promise<Role> {
    const role = this.repo.create(data);
    return this.repo.save(role);
  }

  update(id: number, data: UpdateRoleDto): Promise<Role> {
    return this.repo.save({ id, ...data });
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
