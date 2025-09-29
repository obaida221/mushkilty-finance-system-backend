import { IsArray, ArrayNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssignPermissionsDto {
  @ApiProperty({ type: [String], example: ['users:read', 'roles:update'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  permissions: string[];

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  replace?: boolean = false;
}
