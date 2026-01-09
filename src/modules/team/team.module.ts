import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../project/entities/project.entity';
import { Task } from '../task/entities/task.entity';
import { ProjectAssignedUser } from '../project-assigned-users/entities/project-assigned-user.entity';
import { UserModule } from '../user/user.module';

@Module({
    imports:[TypeOrmModule.forFeature([Task,ProjectAssignedUser]),UserModule]
})
export class TeamModule {
}
