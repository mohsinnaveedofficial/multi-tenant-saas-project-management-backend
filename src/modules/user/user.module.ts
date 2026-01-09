import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Task } from '../task/entities/task.entity';
import { ProjectAssignedUser } from '../project-assigned-users/entities/project-assigned-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Task,ProjectAssignedUser])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
