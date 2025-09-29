import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiPropertyOptional({ example: 'Alex Doe' })
  name?: string;

  @ApiProperty({ description: 'Already hashed password' })
  password_hash: string;

  @ApiProperty({ example: 1 })
  role_id: number;
}
