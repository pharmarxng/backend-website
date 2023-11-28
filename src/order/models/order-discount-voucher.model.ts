import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type OrderDiscountVoucherDocument =
  HydratedDocument<OrderDiscountVoucher>;

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
export class OrderDiscountVoucher {
  @Prop({ type: String, required: true, unique: true })
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'ASW231MKL',
    description: 'Discount code that can be applied to an order',
  })
  discountCode: string;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    type: Number,
    example: 2000,
    description:
      'Percentage discount that would be removed from the order price',
  })
  percentage: number;
}

export const OrderDiscountVoucherSchema =
  SchemaFactory.createForClass(OrderDiscountVoucher);
OrderDiscountVoucherSchema.plugin(mongoosePaginate);
