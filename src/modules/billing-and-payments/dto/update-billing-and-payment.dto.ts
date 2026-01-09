import { PartialType } from '@nestjs/mapped-types';
import { CreateBillingAndPaymentDto } from './create-billing-and-payment.dto';

export class UpdateBillingAndPaymentDto extends PartialType(CreateBillingAndPaymentDto) {}
