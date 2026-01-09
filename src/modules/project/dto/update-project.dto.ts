import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { ProjectStatus } from '../enums/project-status.enum';

export class UpdateProjectDto {
  @IsString()
  name: string;

  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @IsNumber()
  budget: number;

  @IsDateString()
  end: Date;
}
