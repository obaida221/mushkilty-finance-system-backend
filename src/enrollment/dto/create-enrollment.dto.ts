import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsDateString,
  IsIn,
  IsNumber,
  MaxLength,
} from 'class-validator';

export class CreateEnrollmentDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  student_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  batch_id: number;

  @ApiPropertyOptional({ example: 'DISCOUNT2024' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  discount_code?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  user_id: number;

  @ApiPropertyOptional({ example: 200000 })
  @IsOptional()
  @IsNumber()
  total_price?: number;

  @ApiPropertyOptional({ example: 'IQD', description: 'USD|IQD' })
  @IsOptional()
  @IsString()
  @IsIn(['USD', 'IQD'])
  currency?: string;

  @ApiPropertyOptional({ example: '2024-01-15T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  enrolled_at?: Date;

  @ApiPropertyOptional({
    example: 'pending',
    description: 'pending, accepted, dropped, completed',
  })
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'accepted', 'dropped', 'completed'])
  status?: string;

  @ApiPropertyOptional({ example: 'Student requested evening classes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
