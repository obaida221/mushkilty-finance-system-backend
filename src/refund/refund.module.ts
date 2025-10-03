import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefundService } from './refund.service';
import { RefundController } from './refund.controller';
import { Refund } from './entities/refund.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Refund])],
  controllers: [RefundController],
  providers: [RefundService],
  exports: [RefundService],
})
export class RefundModule {}