import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsDateString,
  IsBoolean,
  IsNumber,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class CreateDiscountCodeDto {
  @ApiProperty({ example: 'STUDENT2024' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  code: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  user_id: number;

  @ApiProperty({ example: 'Student Discount 2024' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Special discount for new students' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  purpose: string;

  @ApiPropertyOptional({ example: 50000 })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiPropertyOptional({ example: 'IQD', description: 'USD|IQD' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string | null;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  percent?: number;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsInt()
  usage_limit?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  used_count?: number;

  @ApiPropertyOptional({ example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  valid_from?: Date | null;

  @ApiPropertyOptional({ example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  valid_to?: Date | null;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
