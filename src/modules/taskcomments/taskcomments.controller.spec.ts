import { Test, TestingModule } from '@nestjs/testing';
import { TaskcommentsController } from './taskcomments.controller';
import { TaskcommentsService } from './taskcomments.service';

describe('TaskcommentsController', () => {
  let controller: TaskcommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskcommentsController],
      providers: [TaskcommentsService],
    }).compile();

    controller = module.get<TaskcommentsController>(TaskcommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
