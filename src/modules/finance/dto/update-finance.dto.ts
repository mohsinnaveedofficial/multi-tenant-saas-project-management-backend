import { PartialType } from '@nestjs/mapped-types';
import { CreateFinanceDto } from './create-finance.dto';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { ProjectStatus } from '../enums/project-status.enum';

export class UpdateFinanceDto {
  @IsNumber()
  revenue: number;

  @IsNumber()
  cost: number;

  @IsEnum(ProjectStatus)
  status: ProjectStatus;
}
