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
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { GetStaff } from 'src/configs/decorators';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // @Post()
  // create(@Body() createOrderDto: CreateOrderDto,@GetStaff('sub') staffId:string) {
  //   return this.orderService.create(createOrderDto,staffId);
  // }

  // @Get('user')
  // findOrderOfUser(@Query('userId') userId: string) {
  //   return this.orderService.findOrderOfUser(userId);
  // }

  // @Get('service-user-booked')
  // findServiceOfUserBooked(@Query('userId') userId: string) {
  //   return this.orderService.findServiceOfUserBooked(userId);
  // }

  // @Get(':id')
  // findOrderByOrderId(@Param('id') orderId: string) {
  //   console.log("🚀 ~ OrderController ~ findOrderByOrderId ~ orderId:", orderId)
  //   return this.orderService.findOrderByOrderId(orderId);
  // }
}
