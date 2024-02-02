import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsEmail,
  IsMongoId,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { FindManyDto } from 'src/common';

export class InviteAdminDto {
  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsEmail()
  @IsString()
  email: string;
}

export class AdminLoginDto {
  @IsOptional()
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}

export class GetProductsQueryDto extends FindManyDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  categoryId?: string;
}
export class AddCategoryDto {
  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class EditCategoryDto {
  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  categoryId: string;

  @IsNotEmpty()
  @IsNumber()
  noOfUnitsAvailable: number;
}

export class EditProductDto {
  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsMongoId()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsNumber()
  noOfUnitsAvailable?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => String)
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return false;
  })
  inStock?: boolean;
}

export class ConfirmOrder {
  @IsBoolean()
  @IsNotEmpty()
  @Type(() => String)
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return false;
  })
  confirm: boolean;
}
