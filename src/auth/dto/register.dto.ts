import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsNumber } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'SecurePass123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 1, description: 'Role ID to assign to user' })
  @IsNumber()
  role_id: number;
}