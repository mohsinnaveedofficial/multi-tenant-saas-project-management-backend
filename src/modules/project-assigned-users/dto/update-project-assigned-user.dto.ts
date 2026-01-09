import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectAssignedUserDto } from './create-project-assigned-user.dto';

export class UpdateProjectAssignedUserDto extends PartialType(CreateProjectAssignedUserDto) {}
