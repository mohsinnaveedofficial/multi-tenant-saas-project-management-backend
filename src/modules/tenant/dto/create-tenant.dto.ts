import { IsEmail, IsString } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  companyName: string;

  @IsEmail()
  companyEmail: string;
}
