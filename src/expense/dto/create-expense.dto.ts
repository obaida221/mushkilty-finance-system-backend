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

  @ApiPropertyOptional({ example: 'online', description: 'online|onsite|kids|ielts' })
  @IsOptional()
  @IsString()
  @IsIn(['online', 'onsite', 'kids', 'ielts'])
  project_type?: string;

  @ApiPropertyOptional({ example: 'salary', description: 'salary|marketing|equipment|other' })
  @IsOptional()
  @IsString()
  @IsIn(['salary', 'marketing', 'equipment', 'other'])
  category?: string;

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