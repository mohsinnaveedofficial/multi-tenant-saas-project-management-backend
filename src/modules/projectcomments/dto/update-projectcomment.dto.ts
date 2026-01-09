import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectcommentDto } from './create-projectcomment.dto';

export class UpdateProjectcommentDto extends PartialType(CreateProjectcommentDto) {}
