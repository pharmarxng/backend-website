import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class InviteAdminDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
}
