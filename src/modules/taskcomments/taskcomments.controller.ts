import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskcommentsService } from './taskcomments.service';
import { CreateTaskcommentDto } from './dto/create-taskcomment.dto';
import { UpdateTaskcommentDto } from './dto/update-taskcomment.dto';

@Controller('taskcomments')
export class TaskcommentsController {
  constructor(private readonly taskcommentsService: TaskcommentsService) {}

  // @Post()
  // create(@Body() createTaskcommentDto: CreateTaskcommentDto) {
  //   return this.taskcommentsService.create(createTaskcommentDto);
  // }

  // @Get()
  // findAll() {
  //   return this.taskcommentsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.taskcommentsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTaskcommentDto: UpdateTaskcommentDto) {
  //   return this.taskcommentsService.update(+id, updateTaskcommentDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.taskcommentsService.remove(+id);
  // }
}
