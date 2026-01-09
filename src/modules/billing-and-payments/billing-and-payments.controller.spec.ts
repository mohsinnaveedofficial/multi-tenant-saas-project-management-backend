import { Test, TestingModule } from '@nestjs/testing';
import { BillingAndPaymentsController } from './billing-and-payments.controller';
import { BillingAndPaymentsService } from './billing-and-payments.service';

describe('BillingAndPaymentsController', () => {
  let controller: BillingAndPaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillingAndPaymentsController],
      providers: [BillingAndPaymentsService],
    }).compile();

    controller = module.get<BillingAndPaymentsController>(BillingAndPaymentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
