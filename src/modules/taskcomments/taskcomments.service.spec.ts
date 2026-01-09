import { Test, TestingModule } from '@nestjs/testing';
import { TaskcommentsService } from './taskcomments.service';

describe('TaskcommentsService', () => {
  let service: TaskcommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskcommentsService],
    }).compile();

    service = module.get<TaskcommentsService>(TaskcommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
