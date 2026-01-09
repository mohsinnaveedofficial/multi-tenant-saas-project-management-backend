import { Test, TestingModule } from '@nestjs/testing';
import { ProjectAssignedUsersService } from './project-assigned-users.service';

describe('ProjectAssignedUsersService', () => {
  let service: ProjectAssignedUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectAssignedUsersService],
    }).compile();

    service = module.get<ProjectAssignedUsersService>(ProjectAssignedUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
