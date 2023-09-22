import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type UserDocument = HydratedDocument<User>;

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
export class User {
  @Prop({ type: String, required: true, lowercase: true })
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'John',
    description: 'first name of user',
  })
  firstName: string;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'Micheal',
    description: 'Last name of user',
  })
  lastName: string;

  @Prop({ type: String, unique: true })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @ApiProperty({ type: String, example: 'test@yahoo.com' })
  email: string;

  @Prop({ unique: true })
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be valid with + sign',
  })
  @ApiProperty({ type: String, example: '+639171234567' })
  phone: string;

  @Prop({ type: String })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @ApiProperty({
    type: String,
    minLength: 5,
    description: 'User password',
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(mongoosePaginate);
