import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'admin' })
  name: string;

  @ApiPropertyOptional({ example: 'Administrative role with full access' })
  description?: string;
}
