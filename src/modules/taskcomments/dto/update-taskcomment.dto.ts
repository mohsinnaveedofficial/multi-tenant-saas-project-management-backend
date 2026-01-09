import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskcommentDto } from './create-taskcomment.dto';

export class UpdateTaskcommentDto extends PartialType(CreateTaskcommentDto) {}
