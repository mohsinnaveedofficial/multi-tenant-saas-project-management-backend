import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private projectRepo: Repository<Project>,
    private userService: UserService,
  ) {}

  async create(createProjectDto: CreateProjectDto, userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(
        `Client with id ${createProjectDto.clientId} not found for this tenant`,
      );
    }
    const project = this.projectRepo.create({
      name: createProjectDto.name,
      budget: createProjectDto.budget,
      clientId: createProjectDto.clientId,
      tenantId: user.tenantId,
      end: createProjectDto.end,
      start: new Date(),
    });

    await this.projectRepo.save(project);

    return project;
  }

  async findAll(id: string) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return await this.projectRepo.find({
      where: {
        tenantId: user.tenantId,
      },
      relations: {
        comments: true,
        assignedUsers: {
          user: true,
        },
        client: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async update(
    projectid: string,
    updateProjectDto: UpdateProjectDto,
    userId: string,
  ) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const project = await this.projectRepo.findOne({
      where: { id: projectid, tenantId: user.tenantId },
    });

    if (!project) {
      throw new NotFoundException(
        `Project with id ${projectid} not found for this tenant`,
      );
    }

    await this.projectRepo.update({ id: projectid }, updateProjectDto);

    return this.projectRepo.findOne({ where: { id: projectid } });
  }

  async remove(id: string, userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const project = await this.projectRepo.findOne({
      where: { id: id, tenantId: user.tenantId },
    });

    if (!project) {
      throw new NotFoundException(
        `Project with id ${id} not found for this tenant`,
      );
    }
    const deleted = await this.projectRepo.delete(id);
    if (deleted.affected === 0) {
      throw new ConflictException(`Project with ID ${id} not deleted`);
    }
    return { message: 'Successfully Deleted' };
  }

  async findOneByTenantId(tenantId: string, projectId: string) {
    return await this.projectRepo.find({
      where: {
        id: projectId,
        tenantId,
      },
    });
  }

  async findOne(id: string) {
    return await this.projectRepo.findOneBy({ id });
  }

  async findAllProject(userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    return await this.projectRepo.find({
      where: {
        assignedUsers: { userId },
      },
      relations: {
        assignedUsers: { user: true },
        client:true
      },
    });
  }

  async findCompleteProjectDetails(projectId: string, userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return await this.projectRepo.findOne({
      where: {
        id: projectId,
        tenantId: user.tenantId,
      },
      relations: {
        comments: true,
        assignedUsers: {
          user: true,
        },
        tasks: true,
        client: true,
      },
    });
  }
}
