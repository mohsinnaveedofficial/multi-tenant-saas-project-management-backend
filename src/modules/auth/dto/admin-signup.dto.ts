import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateTenantDto } from 'src/modules/tenant/dto/create-tenant.dto';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

export class AdminSignupDto {
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @ValidateNested()
  @Type(() => CreateTenantDto)
  tenant: CreateTenantDto;
}
