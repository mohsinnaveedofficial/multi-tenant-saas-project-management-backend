import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BillingAndPaymentsService } from './billing-and-payments.service';
import { CreateBillingAndPaymentDto } from './dto/create-billing-and-payment.dto';
import { UpdateBillingAndPaymentDto } from './dto/update-billing-and-payment.dto';

@Controller('billing-and-payments')
export class BillingAndPaymentsController {
  constructor(private readonly billingAndPaymentsService: BillingAndPaymentsService) {}

  // @Post()
  // create(@Body() createBillingAndPaymentDto: CreateBillingAndPaymentDto) {
  //   return this.billingAndPaymentsService.create(createBillingAndPaymentDto);
  // }

  @Get()
  findAll() {
    return this.billingAndPaymentsService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.billingAndPaymentsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBillingAndPaymentDto: UpdateBillingAndPaymentDto) {
  //   return this.billingAndPaymentsService.update(+id, updateBillingAndPaymentDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.billingAndPaymentsService.remove(+id);
  // }
}
