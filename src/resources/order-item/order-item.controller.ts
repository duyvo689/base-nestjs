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
import { OrderItemService } from './order-item.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Controller('order-item')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post()
  create(@Body() createOrderItemDto: CreateOrderItemDto) {
    return this.orderItemService.create(createOrderItemDto);
  }

  @Get('user')
  findOrderItemByUser(@Query('userId') userId: string) {
    return this.orderItemService.findOrderItemByUser(userId);
  }

  @Get('user-order-group')
  findOrderGroupByUser(@Query('userId') userId: string) {
    return this.orderItemService.findOrderGroupByUser(userId);
  }
}

