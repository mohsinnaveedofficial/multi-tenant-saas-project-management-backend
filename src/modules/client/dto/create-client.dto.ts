import { IsEmail, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name: string;

  @IsString()
  companyName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;
}
