import { IsArray, ArrayNotEmpty, IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssignPermissionsDto {
  @ApiProperty({ type: [String], example: ['users:read', 'roles:update'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsOptional()
  permissions?: string[];

  @ApiPropertyOptional({ type: [Number], example: [1, 2, 3] })
  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  permissionIds?: number[];

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  replace?: boolean = false;
}
