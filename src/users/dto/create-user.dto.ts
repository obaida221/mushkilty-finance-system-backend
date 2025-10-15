import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNumber,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'Alex Doe' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Raw password (will be hashed)',
    example: 'SecurePass123',
  })
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({
    description: 'Already hashed password (alternative to password)',
  })
  @IsOptional()
  @IsString()
  password_hash?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  role_id: number;
}
