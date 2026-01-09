import { Test, TestingModule } from '@nestjs/testing';
import { BillingAndPaymentsService } from './billing-and-payments.service';

describe('BillingAndPaymentsService', () => {
  let service: BillingAndPaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillingAndPaymentsService],
    }).compile();

    service = module.get<BillingAndPaymentsService>(BillingAndPaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
