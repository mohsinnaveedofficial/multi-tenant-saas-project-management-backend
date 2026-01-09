import { Test, TestingModule } from '@nestjs/testing';
import { ProjectcommentsController } from './projectcomments.controller';
import { ProjectcommentsService } from './projectcomments.service';

describe('ProjectcommentsController', () => {
  let controller: ProjectcommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectcommentsController],
      providers: [ProjectcommentsService],
    }).compile();

    controller = module.get<ProjectcommentsController>(ProjectcommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
