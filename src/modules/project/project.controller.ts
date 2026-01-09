import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/enums/user-role.enum';
import { ParamUUIDPipe } from 'src/common/pipes/param-uuid.pipe';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createProjectDto: CreateProjectDto ,@Req() req) {
    return this.projectService.create(createProjectDto,req.user.id);
  }

  
  @Roles(UserRole.ADMIN)
  @Get()
  findAll(@Req() req) {
    return this.projectService.findAll(req.user.id);
  }

  @Get("project-assigned-users")
  findAllAssigned(@Req() req) {
    return this.projectService.findAllProject(req.user.id);
  }

  @Get(":id")
  findOne(@Param("id",new ParamUUIDPipe()) id:string,@Req() req){
    return this.projectService.findCompleteProjectDetails(id,req.user.id)
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id',new ParamUUIDPipe()) id: string, @Body() updateProjectDto: UpdateProjectDto,@Req() req) {
    return this.projectService.update(id, updateProjectDto,req.user.id);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id',new ParamUUIDPipe()) id: string,@Req() req) {
    return this.projectService.remove(id,req.user.id);
  }


  
}
