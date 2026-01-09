import { IsDateString, IsEnum, IsString, IsUUID } from 'class-validator';
import { TaskPriority } from '../enums/task.enum';
import { ProjectUserRole } from 'src/modules/project-assigned-users/enums/project-user-role.enum';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsUUID()
  @IsString()
  projectId: string;

 @IsUUID()
  @IsString()
  assignedTo: string;

  @IsEnum(TaskPriority)
  priority:TaskPriority

  @IsDateString()
  dueDate:Date;

  @IsString()
  description:string;

  @IsEnum(ProjectUserRole)
  roleInProject:ProjectUserRole

  

}
