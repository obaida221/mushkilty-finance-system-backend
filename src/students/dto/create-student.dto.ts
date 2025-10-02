import { IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  fullName: string;

  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsDateString()
  dob?: Date;

  @IsOptional()
  @IsString()
  area?: string;

  @IsOptional()
  @IsString()
  courseType?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsNumber()
  userId: number;
}
