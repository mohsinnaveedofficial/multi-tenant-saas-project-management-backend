import { Module } from '@nestjs/common';
import { TaskcommentsService } from './taskcomments.service';
import { TaskcommentsController } from './taskcomments.controller';

@Module({
  controllers: [TaskcommentsController],
  providers: [TaskcommentsService],
})
export class TaskcommentsModule {}
