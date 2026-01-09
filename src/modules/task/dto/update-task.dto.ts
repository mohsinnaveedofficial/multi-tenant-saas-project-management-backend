import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { TaskPriority } from '../enums/task.enum';
import { ProjectUserRole } from 'src/modules/project-assigned-users/enums/project-user-role.enum';

export class UpdateTaskDto {
     @IsString()
      title: string;
    
      @IsUUID()
      @IsString()
      projectId: string;
    
    
    
      @IsEnum(TaskPriority)
      priority:TaskPriority
    
      @IsDateString()
      dueDate:Date;
    
      @IsString()
      description:string;
    
     
}
