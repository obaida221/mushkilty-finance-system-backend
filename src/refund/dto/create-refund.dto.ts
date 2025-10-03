import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsOptional, 
  IsInt, 
  IsDateString,
  IsNotEmpty 
} from 'class-validator';

export class CreateRefundDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  payment_id: number;

  @ApiPropertyOptional({ example: 'Student requested refund due to schedule conflict' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ example: '2024-01-15T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  refunded_at?: Date;
}