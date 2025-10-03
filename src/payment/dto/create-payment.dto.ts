import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsOptional, 
  IsInt, 
  IsDateString, 
  IsIn, 
  IsNumber,
  MaxLength,
  IsNotEmpty 
} from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  payment_method_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  user_id: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  enrollment_id?: number;

  @ApiPropertyOptional({ example: 'Ahmed Ali' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  payer?: string;

  @ApiPropertyOptional({ example: 'First installment payment' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ example: 100000 })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({ example: 'IQD', description: 'USD|IQD' })
  @IsOptional()
  @IsString()
  @IsIn(['USD', 'IQD'])
  currency?: string;

  @ApiPropertyOptional({ example: 'installment', description: 'installment|full' })
  @IsOptional()
  @IsString()
  @IsIn(['installment', 'full'])
  type?: string;

  @ApiPropertyOptional({ example: '2024-01-15T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  paid_at?: Date;

  @ApiPropertyOptional({ example: 'https://example.com/proof.jpg' })
  @IsOptional()
  @IsString()
  payment_proof?: string;
}