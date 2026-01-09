import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ProjectcommentsService } from './projectcomments.service';
import { CreateProjectcommentDto } from './dto/create-projectcomment.dto';
import { UpdateProjectcommentDto } from './dto/update-projectcomment.dto';
import { ParamUUIDPipe } from 'src/common/pipes/param-uuid.pipe';

@Controller('projectcomments')
export class ProjectcommentsController {
  constructor(private readonly projectcommentsService: ProjectcommentsService) {}

  @Post()
  create(@Body() createProjectcommentDto: CreateProjectcommentDto,@Req() req) {
    return this.projectcommentsService.create(createProjectcommentDto,req.user.id);
  }

  @Get(":id")
  findAll(@Param("id",new ParamUUIDPipe)id:string,@Req() req) {
    return this.projectcommentsService.findAll(req.user.id,id);
  }

  
  @Delete(':id')
  remove(@Param('id',new ParamUUIDPipe()) projectId: string, @Param('id',new ParamUUIDPipe()) commentId: string,@Req() req) {
    return this.projectcommentsService.remove(req.user.id,projectId,commentId);
  }


// @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.projectcommentsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProjectcommentDto: UpdateProjectcommentDto) {
  //   return this.projectcommentsService.update(+id, updateProjectcommentDto);
  // }
}
