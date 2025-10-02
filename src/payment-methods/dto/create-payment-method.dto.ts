import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreatePaymentMethodDto {
  @IsNumber()
  userId: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  methodNumber?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isValid?: boolean;
}
