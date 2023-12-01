import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type TransactionDocument = HydratedDocument<Transaction>;

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
export class Transaction {
  @Prop({ type: String })
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'PH001',
    description: 'OrderId tied to a transaction',
  })
  orderId?: string;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @ApiProperty({ type: String, example: 'test@yahoo.com' })
  email: string;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    type: Number,
    example: 2000,
    description: 'Amount paid for this transaction',
  })
  amount: number;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'fchgcccy777',
    description: 'reference for a transaction',
  })
  reference: string;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'success',
    description: 'status of a transaction',
  })
  status: string;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'bank',
    description: 'channel of a transaction',
  })
  channel: string;

  @Prop({ type: String, required: true, default: 'NGN' })
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'NGN',
  })
  currency: string;

  @Prop({ type: Date, required: true })
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'date of a transaction',
  })
  transaction_date: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
TransactionSchema.plugin(mongoosePaginate);
