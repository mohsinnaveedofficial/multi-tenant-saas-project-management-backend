import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ProjectAssignedUsersService } from './project-assigned-users.service';
import { CreateProjectAssignedUserDto } from './dto/create-project-assigned-user.dto';
import { UpdateProjectAssignedUserDto } from './dto/update-project-assigned-user.dto';

@Controller('project-assigned-users')
export class ProjectAssignedUsersController {
  constructor(private readonly projectAssignedUsersService: ProjectAssignedUsersService) {}

  // @Post()
  // create(@Body() createProjectAssignedUserDto: CreateProjectAssignedUserDto) {
  //   return this.projectAssignedUsersService.create(createProjectAssignedUserDto);
  // }

  // @Get()
  // findAll(@Req() req) {
  //   return this.projectAssignedUsersService.findallProject(req.user.id);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.projectAssignedUsersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProjectAssignedUserDto: UpdateProjectAssignedUserDto) {
  //   return this.projectAssignedUsersService.update(+id, updateProjectAssignedUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.projectAssignedUsersService.remove(+id);
  // }
}
