import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { UserRole } from "../enums/user-role.enum";

export class UpdateTeamDto{
     @IsString()
      name: string;
    
      @IsEmail()
      email: string;
    
      @IsString()
      @IsOptional()
      password: string;

      @IsEnum(UserRole)
      role:UserRole;
}