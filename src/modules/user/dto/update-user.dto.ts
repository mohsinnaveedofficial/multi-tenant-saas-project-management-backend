import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsEmpty, IsOptional, IsString } from 'class-validator';


export class UpdateUserDto {
    @IsString()
    name:string;

    @IsString()
   @IsOptional()
    designation?:string;


    @IsString()
   @IsOptional()
    bio?:string;

    @IsString()
    @IsOptional()
    phoneNumber?:string;

    @IsString()
    password:string;

}
