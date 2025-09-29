// src/permissions/dto/create-permission.dto.ts
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({ example: 'transactions:approve' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Allows approving a transaction' })
  @IsOptional()
  @IsString()
  description?: string;
}
