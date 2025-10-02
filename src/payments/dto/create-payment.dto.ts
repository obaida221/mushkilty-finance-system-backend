import {
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  IsDecimal,
} from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  paymentMethodId: number;

  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  enrollmentId?: number;

  @IsOptional()
  @IsString()
  payer?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsDecimal()
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsDateString()
  paidAt?: Date;

  @IsOptional()
  @IsString()
  paymentProof?: string;

  @IsOptional()
  @IsNumber()
  transactionId?: number;
}
