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

export class CreateExpenseDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  user_id: number;

  @ApiProperty({ example: 'Ahmed Ali - Trainer' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  beneficiary: string;

  @ApiPropertyOptional({ example: 'Monthly salary payment' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 500000 })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({ example: 'IQD', description: 'USD|IQD' })
  @IsOptional()
  @IsString()
  @IsIn(['USD', 'IQD'])
  currency?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z' })
  @IsDateString()
  expense_date: Date;
}