import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { DeliveryType, OrderStatus, PAYMENT_TYPE } from 'src/common';
import { OrderedProducts } from './ordered-products.model';
import { Collections } from 'src/collections';
import { Transform } from 'class-transformer';

export type OrderDocument = HydratedDocument<Order>;

@Schema({
  versionKey: false,
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class Order {
  @Prop({ type: String })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @ApiProperty({ type: String, example: 'test@yahoo.com' })
  email: string;

  @Prop({ type: String, unique: true })
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'PH001',
    description: 'unique identifier for an order ',
  })
  orderId?: string;

  @Prop({ type: String })
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'John Doe',
    description: 'first name of user',
  })
  firstName?: string;

  @Prop({ type: String })
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'John Doe',
    description: 'last name of user',
  })
  lastName?: string;

  @Prop({ type: String })
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    example: '10, Admiralty Way, Lekki, Lagos',
    description: 'Delivery Address',
  })
  address?: string;

  @Prop({ type: String })
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'Lagos',
    description: 'Delivery City',
  })
  city?: string;

  @Prop()
  @IsOptional()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be valid with + sign',
  })
  @ApiProperty({ type: String, example: '+639171234567' })
  phone?: string;

  @Prop({ type: String })
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    example: '112233',
    description: 'Delivery Postal Code',
  })
  postalCode?: string;

  @Prop({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    type: Number,
    example: 123,
    description: 'Base price of order without extras(delivery fee, discount)',
  })
  subTotal: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Collections.orderDiscountVoucher,
    required: false,
  })
  @IsOptional()
  @IsString()
  discountVoucher?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Collections.orderDeliveryFees,
    required: false,
  })
  deliveryFee?: string;

  @Prop({ type: Number, default: 0 })
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    type: Number,
    example: 123,
    description: 'Total price for order',
  })
  total: number;

  @Prop({ type: String, default: DeliveryType.pickup })
  @IsEnum(DeliveryType)
  @IsNotEmpty()
  deliveryType: DeliveryType;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return false;
  })
  @IsNotEmpty()
  isPaid: boolean;

  @Prop({ type: String })
  @IsOptional()
  @IsEnum(PAYMENT_TYPE)
  paymentType?: PAYMENT_TYPE;

  @Prop({ type: String })
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'authorization url from payment channel',
  })
  authorization_url?: string;

  @Prop({ type: String })
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'payment reference from payment channel',
  })
  payment_reference?: string;

  @Prop({ type: String, default: OrderStatus.ONGOING })
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Collections.orderedProducts,
      },
    ],
  })
  products: OrderedProducts[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.plugin(mongoosePaginate);
