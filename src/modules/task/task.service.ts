import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { ProjectService } from '../project/project.service';
import { ProjectAssignedUsersService } from '../project-assigned-users/project-assigned-users.service';
import { TaskStatus } from './enums/task.enum';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskrepo: Repository<Task>,
    private userServices: UserService,
    private projectServices: ProjectService,
    private assignedService: ProjectAssignedUsersService,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    const user = await this.userServices.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const tenantId = user.tenantId;
    const project = this.projectServices.findOneByTenantId(
      tenantId,
      createTaskDto.projectId,
    );
    if (!project) {
      throw new NotFoundException(
        `Project not found or does not belong to your tenant`,
      );
    }

    const assignee = await this.userServices.findOne(createTaskDto.assignedTo);
    if (!assignee || assignee.tenantId !== tenantId) {
      throw new BadRequestException(
        `Assigned user does not belong to your tenant`,
      );
    }

    const task = this.taskrepo.create({
      name: createTaskDto.title,
      assignedTo: createTaskDto.assignedTo,
      description: createTaskDto.description,
      dueDate: createTaskDto.dueDate,
      priority: createTaskDto.priority,
      projectId: createTaskDto.projectId,
      tenantId: tenantId,
      assignee,
    });

    await this.taskrepo.save(task);

    const assignedProject = await this.assignedService.assignProject(
      createTaskDto.projectId,
      createTaskDto.assignedTo,
      createTaskDto.roleInProject,
    );
    console.log(task)
    return task;
  }

  async findAll(userId: string) {
    const user = await this.userServices.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    const tasks = await this.taskrepo.find({
      where: { tenantId: user.tenantId },
      relations: { project: true, assignee: true },
    });
    console.log(tasks)
    return tasks;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const user = await this.userServices.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const tenantId = user.tenantId;
    const project = this.projectServices.findOneByTenantId(
      tenantId,
      updateTaskDto.projectId,
    );
    if (!project) {
      throw new NotFoundException(
        `Project not found or does not belong to your tenant`,
      );
    }

    // const assignee = await this.userServices.findOne(updateTaskDto.assignedTo);
    // if (!assignee || assignee.tenantId !== tenantId) {
    //   throw new BadRequestException(
    //     `Assigned user does not belong to your tenant`,
    //   );
    // }

    const task = this.taskrepo.update(
      { id: id },
      {
        name: updateTaskDto.title,
        // assignedTo: updateTaskDto.assignedTo,
        description: updateTaskDto.description,
        dueDate: updateTaskDto.dueDate,
        priority: updateTaskDto.priority,
        // projectId: updateTaskDto.projectId,
        // tenantId: tenantId,
        // assignee,
      },
    );

    // const assignedProject = await this.assignedService.assignProject(
    //   updateTaskDto.projectId,
    //   updateTaskDto.assignedTo,
    //   // updateTaskDto.roleInProject,
    // );
    return this.taskrepo.findOne({
      where: { id },
      relations: { project: true, assignee: true },
    });
  }

  async remove(id: string, userId: string) {
    const user = await this.userServices.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const tenantId = user.tenantId;

    const taskBelong = await this.taskrepo.findOne({ where: { id, tenantId } });
    if (!taskBelong) {
      throw new NotFoundException(
        `Task not found or does not belong to your tenant`,
      );
    }

    const result = await this.taskrepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} could not be deleted`);
    }

    return { message: 'Successfully Deleted' };
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} task`;
  // }

  async findOneByUser(userId: string) {
    const user = await this.userServices.findOne(userId);
    if (!user) throw new NotFoundException('User not found');
    return await this.taskrepo.find({
      where: { assignedTo: userId, tenantId: user.tenantId },
      relations:{project:true},
    });
  }

  async updateStatus(userId: string, taskId: string, status: TaskStatus) {
    const TASK_STATUS_PROGRESS:Record<TaskStatus,number> = {
  [TaskStatus.TODO]: 0,
  [TaskStatus.IN_PROGRESS]: 40,
  [TaskStatus.REVIEW]: 70,
  [TaskStatus.COMPLETED]: 100,
  [TaskStatus.DELAYED]: 20,
};
    const user = await this.userServices.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    const task = await this.taskrepo.findOne({
      where: { id: taskId, assignedTo: userId, tenantId: user.tenantId },
    });
    if (!task) throw new NotFoundException('Task not found');
    

    task.status = status;
    task.progressPercentage=TASK_STATUS_PROGRESS[status]
    await this.taskrepo.save(task);

    return task;
  }
}
