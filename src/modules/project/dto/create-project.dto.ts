import {  IsDateString, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsUUID()
  @IsString()
  clientId: string;

  @IsNumber()
  budget: number;

  @IsDateString()
  end: Date;
}
