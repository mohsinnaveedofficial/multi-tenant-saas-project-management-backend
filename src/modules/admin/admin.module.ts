import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModule } from '../project/project.module';
import { Project } from '../project/entities/project.entity';
import { Client } from '../client/entities/client.entity';
import { Task } from '../task/entities/task.entity';
import { Finance } from '../finance/entities/finance.entity';
import { AdminService } from './admin.service';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  imports: [
    UserModule,
    ProjectModule,
    TenantModule,
    TypeOrmModule.forFeature([Project, Client, Task, Finance]),
  ],
providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
