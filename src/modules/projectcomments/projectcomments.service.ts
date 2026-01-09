import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectcommentDto } from './dto/create-projectcomment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Projectcomment } from './entities/projectcomment.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { ProjectService } from '../project/project.service';

@Injectable()
export class ProjectcommentsService {
  constructor(
    @InjectRepository(Projectcomment)
    private ProjectCommnetRepo: Repository<Projectcomment>,
    private userServices: UserService,
    private projectService: ProjectService,
  ) {}

  async create(
    createProjectcommentDto: CreateProjectcommentDto,
    userId: string,
  ) {
    await this.check_Project(userId, createProjectcommentDto.projectId);

    const comments = this.ProjectCommnetRepo.create({
      userId: userId,
      comment: createProjectcommentDto.comment,
      projectId: createProjectcommentDto.projectId,
    });

    await this.ProjectCommnetRepo.save(comments);
    return comments
  }

  async findAll(userId: string, projectId: string) {
    await this.check_Project(userId, projectId);
    return this.ProjectCommnetRepo.find({ where: { projectId: projectId } });
  }

  async remove(userId: string, projectId: string, commentId: string) {
    await this.check_Project(userId, projectId);
    const comment = await this.ProjectCommnetRepo.findOne({
      where: { id: commentId, projectId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found in this project');
    }

    const res = await this.ProjectCommnetRepo.delete(commentId);
    if (res.affected === 0) {
      throw new ConflictException('Comment not deleted');
    }
    return { message: 'Comment deleted successfully' };
  }

  async check_Project(userId: string, projectId: string) {
    const user = await this.userServices.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const project = await this.projectService.findOne(projectId);
    if (!project) {
      throw new NotFoundException(`Project not found`);
    }
    if (user.tenantId !== project.tenantId) {
      throw new NotFoundException(`This project doesn't belong to this tenant`);
    }
    return true;
  }
}
