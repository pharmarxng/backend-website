import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type ProductDocument = HydratedDocument<Product>;

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
export class Product {
  @Prop({ type: String, required: true, lowercase: true })
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
  })
  image: string;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
  })
  name: string;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
  })
  description: string;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    type: Number,
  })
  rating: number;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    type: Number,
  })
  price: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.plugin(mongoosePaginate);
