import { Test, TestingModule } from '@nestjs/testing';
import { ProjectcommentsService } from './projectcomments.service';

describe('ProjectcommentsService', () => {
  let service: ProjectcommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectcommentsService],
    }).compile();

    service = module.get<ProjectcommentsService>(ProjectcommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
