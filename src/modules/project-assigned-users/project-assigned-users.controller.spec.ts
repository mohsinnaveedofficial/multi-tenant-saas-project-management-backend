import { Test, TestingModule } from '@nestjs/testing';
import { ProjectAssignedUsersController } from './project-assigned-users.controller';
import { ProjectAssignedUsersService } from './project-assigned-users.service';

describe('ProjectAssignedUsersController', () => {
  let controller: ProjectAssignedUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectAssignedUsersController],
      providers: [ProjectAssignedUsersService],
    }).compile();

    controller = module.get<ProjectAssignedUsersController>(ProjectAssignedUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
