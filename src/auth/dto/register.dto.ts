import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsInt,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsInt()
  role_id: number;
}
