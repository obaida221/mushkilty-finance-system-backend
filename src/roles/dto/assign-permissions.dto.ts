import {
  IsArray,
  // ArrayNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AssignPermissionsDto {
  @ApiPropertyOptional({
    type: [String],
    example: ['users:read', 'roles:update'],
    description: 'Array of permission names to assign to the role',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissions?: string[];

  @ApiPropertyOptional({
    type: [Number],
    example: [1, 2, 3],
    description: 'Array of permission IDs to assign to the role',
  })
  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  permissionIds?: number[];

  @ApiPropertyOptional({
    default: false,
    description:
      'If true, replaces all existing permissions. If false, adds to existing permissions.',
  })
  @IsOptional()
  @IsBoolean()
  replace?: boolean = false;
}
