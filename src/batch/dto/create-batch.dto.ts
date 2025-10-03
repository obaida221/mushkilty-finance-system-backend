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

export class CreateBatchDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  course_id: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  trainer_id: number;

  @ApiProperty({ example: 'English A1 - Morning Batch' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ example: 'Beginner level English course' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'A1', description: 'A1, A2, B1, B2, C1' })
  @IsOptional()
  @IsString()
  @IsIn(['A1', 'A2', 'B1', 'B2', 'C1'])
  level?: string;

  @ApiPropertyOptional({ example: 'Main Campus - Room 101' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @ApiPropertyOptional({ example: '2024-01-15' })
  @IsOptional()
  @IsDateString()
  start_date?: Date;

  @ApiPropertyOptional({ example: '2024-06-15' })
  @IsOptional()
  @IsDateString()
  end_date?: Date;

  @ApiPropertyOptional({ example: 'every monday, wednesday, friday at 3pm' })
  @IsOptional()
  @IsString()
  schedule?: string;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @IsInt()
  capacity?: number;

  @ApiPropertyOptional({ example: 'open', description: 'open, closed, full' })
  @IsOptional()
  @IsString()
  @IsIn(['open', 'closed', 'full'])
  status?: string;

  @ApiPropertyOptional({ example: 250000 })
  @IsOptional()
  @IsNumber()
  actual_price?: number;
}