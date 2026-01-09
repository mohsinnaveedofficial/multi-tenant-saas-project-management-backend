import { Module } from '@nestjs/common';
import { BillingAndPaymentsService } from './billing-and-payments.service';
import { BillingAndPaymentsController } from './billing-and-payments.controller';

@Module({
  controllers: [BillingAndPaymentsController],
  providers: [BillingAndPaymentsService],
})
export class BillingAndPaymentsModule {}
