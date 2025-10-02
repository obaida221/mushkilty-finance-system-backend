import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsDecimal,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  transactionType: string;

  @IsNumber()
  userId: number;

  @IsDecimal()
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  referenceType?: string;

  @IsOptional()
  @IsNumber()
  referenceId?: number;

  @IsOptional()
  @IsDateString()
  occurredAt?: Date;
}