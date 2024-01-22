import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, IsEmail } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { AdminRole } from 'src/common';
import * as bcrypt from 'bcryptjs';

export type AdminDocument = HydratedDocument<Admin>;

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
export class Admin {
  @Prop({ type: String, required: true, lowercase: true })
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'John',
    description: 'first name of admin',
  })
  firstName: string;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'Micheal',
    description: 'Last name of admin',
  })
  lastName: string;

  @Prop({ type: String, unique: true })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @ApiProperty({ type: String, example: 'test@yahoo.com' })
  email: string;

  // @Prop({ unique: true })
  // @IsNotEmpty()
  // @Matches(/^\+[1-9]\d{1,14}$/, {
  //   message: 'Phone number must be valid with + sign',
  // })
  // @ApiProperty({ type: String, example: '+639171234567' })
  // phone: string;

  @Prop({ type: String })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @ApiProperty({
    type: String,
    minLength: 5,
    description: 'Admin password',
  })
  password: string;

  @Prop({
    type: [String],
    default: AdminRole.MASTER_ADMIN,
    required: true,
    enum: AdminRole,
  })
  roles: AdminRole[];
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
AdminSchema.plugin(mongoosePaginate);
AdminSchema.pre('save', async function (next) {
  const admin = this as AdminDocument;
  if (!admin.isModified('password')) return next();
  const salt = await bcrypt.genSalt(
    10,
    // Number(config.get<string>('BCRYPT_HASH_SALT_ROUNDS')),
  );
  admin.password = await bcrypt.hash(admin.password, salt);
  next();
});
