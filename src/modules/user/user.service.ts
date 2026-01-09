import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { TenantService } from '../tenant/tenant.service';
import { CreateTenantDto } from '../tenant/dto/create-tenant.dto';
import { UserRole } from './enums/user-role.enum';
import { AddTeamDto } from './dto/add-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { Task } from '../task/entities/task.entity';
import { ProjectAssignedUser } from '../project-assigned-users/entities/project-assigned-user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(ProjectAssignedUser)
    private projectAssignedRepo: Repository<ProjectAssignedUser>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    tenantId: string,
    manager?: EntityManager,
  ) {
    const user = this.userRepo.create({
      tenantId: tenantId,
      name: createUserDto.name,
      email: createUserDto.email,
      passwordHash: createUserDto.password,
      role: UserRole.ADMIN,
    });

    if (manager) {
      return manager.save(user);
    }

    await this.userRepo.save(user);
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepo.findOne({
      where: {
        email,
      },
      relations: ['tenant'],
    });

    return user;
  }

  async updateHashedRefreshToken(
    userId: string,
    hashedRefreshToken: string | null,
  ) {
    return await this.userRepo.update(
      { id: userId },
      { hashedRefreshToken: hashedRefreshToken },
    );
  }

  findOne(id: string) {
    return this.userRepo.findOne({
      where: { id },
      select: [
        'name',
        'role',
        'id',
        'profileImage',
        'status',
        'hashedRefreshToken',
        'tenantId',
      ],
    });
  }

  async findAll(userId: string) {
    const tenant = await this.findOne(userId);
    if (!tenant) {
      throw new NotFoundException('User not found ');
    }
    const alluser = await this.userRepo.find({
      where: { tenantId: tenant.tenantId },
    });
    return alluser;
  }

  async AddUser(userId: string, addTeamDto: AddTeamDto) {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const tenantId = user.tenantId;
    const existingUser = await this.userRepo.findOne({
      where: { email: addTeamDto.email, tenantId },
    });
    if (existingUser) {
      throw new ConflictException(
        `User with email ${addTeamDto.email} already exists`,
      );
    }
    const newuser = this.userRepo.create({
      name: addTeamDto.name,
      email: addTeamDto.email,
      role: addTeamDto.role,
      tenantId: tenantId,
      passwordHash: addTeamDto.password,
    });

    await this.userRepo.save(newuser);
    return this.findOne(newuser.id);
  }

  async UpdateUser(
    teamId: string,
    updateTeamDto: UpdateTeamDto,
    userId: string,
  ) {
    const existingUser = await this.userRepo.findOne({
      where: { email: updateTeamDto.email },
    });

    if (existingUser && existingUser.id !== teamId) {
      throw new BadRequestException(
        `Email ${updateTeamDto.email} is already taken`,
      );
    }

    let adminUser = await this.findOne(userId);
    if (!adminUser) {
      throw new NotFoundException(`Admin User with not found`);
    }

    const teamUser = await this.findOne(teamId);
    if (!teamUser) {
      throw new NotFoundException(`User with id not found`);
    }

    if (adminUser.tenantId !== teamUser.tenantId) {
      throw new NotFoundException(`User doesn't belong to this tenant`);
    }

    const passwordHash = await bcrypt.hash(updateTeamDto.password, 10);
    await this.userRepo.update(teamId, {
      name: updateTeamDto.name,
      passwordHash: passwordHash,
      email: updateTeamDto.email,
      role: updateTeamDto.role,
    });
    return await this.findOne(teamId);
  }

  async remove(teamId: string, userId: string) {
    let adminUser = await this.findOne(userId);
    if (!adminUser) {
      throw new NotFoundException(`Admin User with not found`);
    }

    const teamUser = await this.findOne(teamId);
    if (!teamUser) {
      throw new NotFoundException(`User with id not found`);
    }

    if (adminUser.tenantId !== teamUser.tenantId) {
      throw new NotFoundException(`User doesn't belong to this tenant`);
    }

    await this.userRepo.delete(teamId);

    return { message: 'deleted Successfully' };
  }

  async getProfile(userId: string) {
    const profile =await this.userRepo.findOne({
      where: { id: userId },
      select: [
        'name',
        'role',
        'id',
        'profileImage',
        'status',
        'bio',
        'designation',
        'tenantId',
        'phoneNumber',
        'createdAt',
      ],
    });

    if(!profile) throw new NotFoundException("User profile not found")

    const tasks = await this.taskRepo.find({
      where: { assignedTo: userId },
    });

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter((t) => t.status === 'completed').length;

    const pendingTasks = tasks.filter(
      (t) => t.status === 'todo' || t.status === 'inProgress',
    ).length;

    const overdueTasks = tasks.filter(
      (t) =>
        t.dueDate &&
        t.status !== 'completed' &&
        new Date(t.dueDate) < new Date(),
    ).length;

    const assignedProjects = await this.projectAssignedRepo.find({
      where: { userId },
    });

    const uniqueProjects = new Set(assignedProjects.map((p) => p.projectId));
    const totalProjects = uniqueProjects.size;

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      totalProjects,
      profile,
    };
  }

  async updateTeamProfile(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(userId);
    if (!user) throw new NotFoundException('User not found');
    const passwordHash = await bcrypt.hash(updateUserDto.password, 10);

    const updateuser = await this.userRepo.update(userId, {
      name: updateUserDto.name,
      phoneNumber: updateUserDto.phoneNumber,
      bio: updateUserDto.bio,
      designation: updateUserDto.designation,
      passwordHash: passwordHash,
    });

    if (updateuser.affected === 0)
      throw new ConflictException('Profile is not updated');
  }
}
