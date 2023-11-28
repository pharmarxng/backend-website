import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { DeliveryType } from 'src/common';
import { OrderedProducts } from '../models';

export class CreateOrderDto {
  @IsEnum(DeliveryType)
  @IsNotEmpty()
  deliveryType: DeliveryType;

  @IsOptional()
  @IsString()
  deliveryFee: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderedProducts)
  products: OrderedProducts[];

  @IsOptional()
  @IsEmail()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be valid with + sign',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  discountCode?: string;
}
