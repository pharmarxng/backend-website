import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDeliveryFeeDto {
  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}

export class UpdateDeliveryFeeDto {
  @IsOptional()
  @IsString()
  location: string;

  @IsOptional()
  @IsNumber()
  price: number;
}
