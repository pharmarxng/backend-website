import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type ReviewsDocument = HydratedDocument<Reviews>;

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
export class Reviews {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
  })
  description: string;
}

export const ReviewsSchema = SchemaFactory.createForClass(Reviews);
ReviewsSchema.plugin(mongoosePaginate);
