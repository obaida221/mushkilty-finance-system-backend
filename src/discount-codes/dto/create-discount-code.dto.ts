import { IsString, IsNumber, IsDateString, IsBoolean } from 'class-validator';

export class CreateDiscountCodeDto {
  @IsString()
  code: string;

  @IsNumber()
  percentage: number;

  @IsDateString()
  validFrom: Date;

  @IsDateString()
  validTo: Date;

  @IsBoolean()
  active: boolean;
}
