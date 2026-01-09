import { Injectable } from '@nestjs/common';
import { CreateTaskcommentDto } from './dto/create-taskcomment.dto';
import { UpdateTaskcommentDto } from './dto/update-taskcomment.dto';

@Injectable()
export class TaskcommentsService {
  create(createTaskcommentDto: CreateTaskcommentDto) {
    return 'This action adds a new taskcomment';
  }

  findAll() {
    return `This action returns all taskcomments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} taskcomment`;
  }

  update(id: number, updateTaskcommentDto: UpdateTaskcommentDto) {
    return `This action updates a #${id} taskcomment`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskcomment`;
  }
}
