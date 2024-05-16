import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { GetStaff } from 'src/configs/decorators';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto, @GetStaff('sub') staffId:string) {
    return this.paymentService.create(createPaymentDto,staffId);
  }

  @Get('user-bill-history')
  findBillHistoryByUser(@Query('userId') userId: string) {
    return this.paymentService.findBillHistoryByUser(userId);
  }

  @Get('user-debt')
  findOrderItemsStillDebt(@Query('userId') userId: string) {
    return this.paymentService.findOrderItemsStillDebt(userId);
  }

  @Delete(':id')
  deleteBillById(@Param('id') billId: string) {
    return this.paymentService.deleteBillById(billId);
  }
}
