import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { DeliveryType, FindManyDto } from 'src/common';
import { OrderedProducts } from '../models';

export class CreateOrderDto {
  @IsEnum(DeliveryType)
  @IsNotEmpty()
  deliveryType: DeliveryType;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsMongoId({ message: 'deliveryFee must be valid with mongoose ObjectId' })
  deliveryFee: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderedProducts)
  products: OrderedProducts[];

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be valid with + sign',
  })
  phone: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  discountCode?: string;
}

export class PayForOrderDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId({ message: 'id must be valid with mongoose ObjectId' })
  id: string;

  @IsOptional()
  @IsString()
  callback_url?: string;
}

export class FetchAllOrdersDto extends FindManyDto {
  @IsOptional()
  @IsEmail()
  @IsString()
  email?: string;
}
