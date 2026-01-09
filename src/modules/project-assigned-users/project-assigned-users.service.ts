import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectAssignedUserDto } from './dto/create-project-assigned-user.dto';
import { UpdateProjectAssignedUserDto } from './dto/update-project-assigned-user.dto';
import { ProjectUserRole } from './enums/project-user-role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectAssignedUser } from './entities/project-assigned-user.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class ProjectAssignedUsersService {
  constructor(@InjectRepository(ProjectAssignedUser) private projectAssignedRepo:Repository<ProjectAssignedUser>,private userservice:UserService){}
  // create(createProjectAssignedUserDto: CreateProjectAssignedUserDto) {
  //   return 'This action adds a new projectAssignedUser';
  // }

  // findAll() {
  //   return `This action returns all projectAssignedUsers`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} projectAssignedUser`;
  // }

  // update(id: number, updateProjectAssignedUserDto: UpdateProjectAssignedUserDto) {
  //   return `This action updates a #${id} projectAssignedUser`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} projectAssignedUser`;
  // }
 async assignProject(projectId:string,userId:string,role:ProjectUserRole){
    const assignedProject=this.projectAssignedRepo.create({
      projectId:projectId,
      userId:userId,
      roleInProject:role
    })
    await this.projectAssignedRepo.save(assignedProject);
    return assignedProject;

  }

  


  // async findallProject(userId:string){
  //   const user=await this.userservice.findOne(userId);
  //   if(!user) throw new NotFoundException("User not found")
  //   const project=await this.projectAssignedRepo.find({where:{userId:userId},relations:{project:{assignedUsers:{user:true}}}})
  //   return project
  // }

}
