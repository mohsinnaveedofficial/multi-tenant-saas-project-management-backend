import { Injectable } from '@nestjs/common';
import { CreateBillingAndPaymentDto } from './dto/create-billing-and-payment.dto';
import { UpdateBillingAndPaymentDto } from './dto/update-billing-and-payment.dto';

@Injectable()
export class BillingAndPaymentsService {
  create(createBillingAndPaymentDto: CreateBillingAndPaymentDto) {
    return 'This action adds a new billingAndPayment';
  }

  findAll() {
    return `This action returns all billingAndPayments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} billingAndPayment`;
  }

  update(id: number, updateBillingAndPaymentDto: UpdateBillingAndPaymentDto) {
    return `This action updates a #${id} billingAndPayment`;
  }

  remove(id: number) {
    return `This action removes a #${id} billingAndPayment`;
  }
}
