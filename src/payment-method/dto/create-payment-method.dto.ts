import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsOptional, 
  IsInt, 
  IsBoolean, 
  IsIn,
  MaxLength,
  IsNotEmpty 
} from 'class-validator';

export class CreatePaymentMethodDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  user_id: number;

  @ApiProperty({ example: 'card', description: 'cash|card|transfer' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['cash', 'card', 'transfer'])
  name: string;

  @ApiPropertyOptional({ example: '1234-5678-9012-3456' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  method_number?: string;

  @ApiPropertyOptional({ example: 'Main business card for payments' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  is_valid?: boolean;
}