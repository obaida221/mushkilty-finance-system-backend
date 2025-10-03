import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsOptional, 
  IsInt, 
  IsDateString, 
  IsIn, 
  IsNumber,
  IsNotEmpty 
} from 'class-validator';

export class CreatePayrollDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  user_id: number;

  @ApiProperty({ example: 1000000 })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({ example: 'IQD', description: 'USD|IQD' })
  @IsOptional()
  @IsString()
  @IsIn(['USD', 'IQD'])
  currency?: string;

  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  period_start: Date;

  @ApiProperty({ example: '2024-01-31' })
  @IsDateString()
  period_end: Date;

  @ApiPropertyOptional({ example: '2024-02-01T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  paid_at?: Date;

  @ApiPropertyOptional({ example: 'January 2024 salary' })
  @IsOptional()
  @IsString()
  note?: string;
}