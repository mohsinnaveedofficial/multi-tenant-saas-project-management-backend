import { Module } from '@nestjs/common';
import { ProjectcommentsService } from './projectcomments.service';
import { ProjectcommentsController } from './projectcomments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ProjectModule } from '../project/project.module';
import { Projectcomment } from './entities/projectcomment.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Projectcomment]),UserModule ,ProjectModule],
  controllers: [ProjectcommentsController],
  providers: [ProjectcommentsService],
})
export class ProjectcommentsModule {}
