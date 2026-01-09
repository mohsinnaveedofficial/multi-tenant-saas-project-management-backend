import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { UserModule } from '../user/user.module';
import { ProjectModule } from '../project/project.module';
import { ProjectAssignedUsersModule } from '../project-assigned-users/project-assigned-users.module';

@Module({
  imports:[TypeOrmModule.forFeature([Task]),UserModule,ProjectModule,ProjectAssignedUsersModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports:[TypeOrmModule]
})
export class TaskModule {}
