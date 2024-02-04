import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type OrderDeliveryFeesDocument = HydratedDocument<OrderDeliveryFees>;

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
export class OrderDeliveryFees {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'Ajah-Sangotedo-Epe',
    description: 'Standard location for delivery',
  })
  location: string;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    type: Number,
    example: 2000,
    description: 'Price to deliver to this location',
  })
  price: number;

  @Prop({
    type: String,
    required: true,
    default:
      'Prices are not fixed and can go up on down depending on the courier',
  })
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
  })
  sideNote: string;
}

export const OrderDeliveryFeesSchema =
  SchemaFactory.createForClass(OrderDeliveryFees);
OrderDeliveryFeesSchema.plugin(mongoosePaginate);
