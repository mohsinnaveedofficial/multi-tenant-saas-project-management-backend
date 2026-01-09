import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/enums/user-role.enum';
import { ParamUUIDPipe } from 'src/common/pipes/param-uuid.pipe';
import { TaskStatus } from './enums/task.enum';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() req) {
    return this.taskService.create(createTaskDto, req.user.id);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  findAll(@Req() req) {
    return this.taskService.findAll(req.user.id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id', new ParamUUIDPipe()) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req,
  ) {
    return this.taskService.update(id, updateTaskDto, req.user.id);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id', new ParamUUIDPipe()) id: string, @Req() req) {
    return this.taskService.remove(id, req.user.id);
  }

  @Get('user')
  findTaskByUser(@Req() req) {
    return this.taskService.findOneByUser(req.user.id);
  }

  @Patch('status/:id')
  updateStatus(
    @Param('id', new ParamUUIDPipe()) id: string,
    @Body() body: { status: TaskStatus },
    @Req() req,
  ) {
    return this.taskService.updateStatus(req.user.id, id, body.status);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.taskService.findOne(+id);
  // }
}
