import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsIn,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  user_id: number;

  @ApiProperty({ example: 'English Language Course - Beginner' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    example: 'online',
    description: 'online|onsite|kids|ielts',
  })
  @IsOptional()
  @IsString()
  @IsIn(['online', 'onsite', 'kids', 'ielts'])
  project_type?: string;

  @ApiPropertyOptional({
    example: 'Comprehensive English course for beginners',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
