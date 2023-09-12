import { IsString, IsEmail } from 'class-validator';

export class DealMake {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;
}
