import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Collections } from 'src/collections';

export type OrderedProductsDocument = HydratedDocument<OrderedProducts>;

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
export class OrderedProducts {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Collections.products,
    required: true,
  })
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: '655e2ddb3a4707e32e9ce601',
    description: 'Ids of products',
  })
  productId: string;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    example: 123,
    description: 'Quantity of each product to be purchased',
  })
  quantity: number;
}

export const OrderedProductsSchema =
  SchemaFactory.createForClass(OrderedProducts);
OrderedProductsSchema.plugin(mongoosePaginate);
