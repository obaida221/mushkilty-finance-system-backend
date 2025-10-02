import { IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateEnrollmentDto {
  @IsNumber()
  studentId: number;

  @IsNumber()
  batchId: number;

  @IsOptional()
  @IsNumber()
  discountCodeId?: number;

  @IsNumber()
  userId: number;

  @IsNumber()
  totalPrice: number;

  @IsString()
  currency: string;

  @IsOptional()
  @IsDateString()
  enrolledAt?: Date;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
