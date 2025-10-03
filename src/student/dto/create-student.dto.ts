import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsOptional, 
  IsInt, 
  IsDateString, 
  IsBoolean, 
  IsIn, 
  MaxLength,
  IsNotEmpty 
} from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 'Ahmed Ali Mohammed' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  full_name: string;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsInt()
  age?: number;

  @ApiPropertyOptional({ example: '1998-01-15' })
  @IsOptional()
  @IsDateString()
  dob?: Date;

  @ApiPropertyOptional({ example: 'Bachelor Degree' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  education_level?: string;

  @ApiPropertyOptional({ example: 'male' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  gender?: string;

  @ApiProperty({ example: '+964 750 123 4567' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  phone: string;

  @ApiPropertyOptional({ example: 'Baghdad' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  city?: string;

  @ApiPropertyOptional({ example: 'Karrada' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  area?: string;

  @ApiPropertyOptional({ example: 'online', description: 'online|onsite|kids|ielts' })
  @IsOptional()
  @IsString()
  @IsIn(['online', 'onsite', 'kids', 'ielts'])
  course_type?: string;

  @ApiPropertyOptional({ example: 'Completed A1 level at another center' })
  @IsOptional()
  @IsString()
  previous_course?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  is_returning?: boolean;

  @ApiPropertyOptional({ 
    example: 'pending', 
    description: 'pending, contacted with, tested, accepted, rejected' 
  })
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'contacted with', 'tested', 'accepted', 'rejected'])
  status?: string;
}
