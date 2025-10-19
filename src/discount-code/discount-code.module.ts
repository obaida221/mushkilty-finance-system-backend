import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountCodeService } from './discount-code.service';
import { DiscountCodeController } from './discount-code.controller';
import { DiscountCode } from './entities/discount-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DiscountCode])],
  controllers: [DiscountCodeController],
  providers: [DiscountCodeService],
  exports: [DiscountCodeService],
})
export class DiscountCodeModule {}
