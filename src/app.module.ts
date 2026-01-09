import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/roles/roles.guard';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ClientModule } from './modules/client/client.module';
import { ProjectModule } from './modules/project/project.module';
import { ProjectAssignedUsersModule } from './modules/project-assigned-users/project-assigned-users.module';
import { TaskModule } from './modules/task/task.module';
import { TaskcommentsModule } from './modules/taskcomments/taskcomments.module';
import { ProjectcommentsModule } from './modules/projectcomments/projectcomments.module';
import { FinanceModule } from './modules/finance/finance.module';
import { ActivityLogModule } from './modules/activity-log/activity-log.module';
import { BillingAndPaymentsModule } from './modules/billing-and-payments/billing-and-payments.module';
import { AdminService } from './modules/admin/admin.service';
import { AdminModule } from './modules/admin/admin.module';
import { TeamController } from './modules/team/team.controller';
import { TeamService } from './modules/team/team.service';
import { TeamModule } from './modules/team/team.module';
import jwtConfig from './modules/auth/config/jwt.config';

@Module({
  imports: [ ConfigModule.forRoot({
      isGlobal: true,      
      load: [jwtConfig],    

    }),
    UserModule,
    AuthModule,
    TenantModule,
    TypeOrmModule.forRoot({
      port: 5432,
      type: 'postgres',
      host: '127.0.0.1',
      username: 'postgres',
      password: 'admin',
      database: 'multi_tenant_saas',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ClientModule,
    ProjectModule,
    ProjectAssignedUsersModule,
    TaskModule,
    TaskcommentsModule,
    ProjectcommentsModule,
    FinanceModule,
    ActivityLogModule,
    BillingAndPaymentsModule,
    AdminModule,
    TeamModule,
  ],
  controllers: [AppController, TeamController],
  providers: [
    AppService,
    // ensure global guards are registered early at the root module so all controllers
    // created afterwards are protected from bootstrap time
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    AdminService,
    TeamService,
  ],
})
export class AppModule {}
