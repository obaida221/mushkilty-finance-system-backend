import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiscountCode } from './entities/discount-code.entity';
import { CreateDiscountCodeDto } from './dto/create-discount-code.dto';
import { UpdateDiscountCodeDto } from './dto/update-discount-code.dto';

@Injectable()
export class DiscountCodeService {
  constructor(
    @InjectRepository(DiscountCode)
    private repository: Repository<DiscountCode>,
  ) {}

  async create(createDto: CreateDiscountCodeDto): Promise<DiscountCode> {
    const entity = this.repository.create(createDto);
    return this.repository.save(entity);
  }

  async findAll(): Promise<DiscountCode[]> {
    return this.repository.find({
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: number): Promise<DiscountCode> {
    const entity = await this.repository.findOne({
      where: { id }
    });
    
    if (!entity) {
      throw new NotFoundException(`DiscountCode with ID ${id} not found`);
    }
    
    return entity;
  }

  async update(id: number, updateDto: UpdateDiscountCodeDto): Promise<DiscountCode> {
    const entity = await this.findOne(id);
    await this.repository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.delete(id);
  }

  async findByCode(code: string): Promise<DiscountCode> {
    const entity = await this.repository.findOne({
      where: { code }
    });
    
    if (!entity) {
      throw new NotFoundException(`Discount code '${code}' not found`);
    }
    
    return entity;
  }

  async validateCode(code: string): Promise<DiscountCode> {
    const discountCode = await this.findByCode(code);
    const currentDate = new Date();

    if (discountCode.valid_to && discountCode.valid_to < currentDate) {
      throw new BadRequestException(`Discount code '${code}' has expired`);
    }

    if (discountCode.usage_limit && discountCode.used_count >= discountCode.usage_limit) {
      throw new BadRequestException(`Discount code '${code}' has reached its usage limit`);
    }

    if (!discountCode.active) {
      throw new BadRequestException(`Discount code '${code}' is not active`);
    }

    return discountCode;
  }

  async incrementUsage(id: number): Promise<void> {
    await this.repository.increment({ id }, 'used_count', 1);
  }

  async findActiveDiscounts(): Promise<DiscountCode[]> {
    const currentDate = new Date();
    return this.repository
      .createQueryBuilder('discount')
      .where('(discount.valid_to IS NULL OR discount.valid_to > :currentDate)', { currentDate })
      .andWhere('(discount.usage_limit IS NULL OR discount.used_count < discount.usage_limit)')
      .andWhere('discount.active = :active', { active: true })
      .orderBy('discount.created_at', 'DESC')
      .getMany();
  }
}