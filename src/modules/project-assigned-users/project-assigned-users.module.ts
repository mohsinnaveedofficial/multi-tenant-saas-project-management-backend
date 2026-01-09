import { Module } from '@nestjs/common';
import { ProjectAssignedUsersService } from './project-assigned-users.service';
import { ProjectAssignedUsersController } from './project-assigned-users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectAssignedUser } from './entities/project-assigned-user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports:[TypeOrmModule.forFeature([ProjectAssignedUser]),UserModule],
  controllers: [ProjectAssignedUsersController],
  providers: [ProjectAssignedUsersService],
  exports:[ProjectAssignedUsersService,TypeOrmModule]
})
export class ProjectAssignedUsersModule {}
