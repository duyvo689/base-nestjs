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
import { GetStaff } from 'src/configs/decorators';

@Controller('order-item')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post()
  create(
    @Body() createOrderItemDto: CreateOrderItemDto[],
    @GetStaff('sub') staffId: string,
  ) {
    return this.orderItemService.create(createOrderItemDto, staffId);
  }

  @Get('user')
  findOrderItemByUser(@Query('userId') userId: string) {
    return this.orderItemService.findOrderItemByUser(userId);
  }

  @Delete('cancel/:id')
  cancelOrderItemById(
    @Param('id') id: string,
    @Body() cancelReasonData: any,
    @GetStaff('sub') staffId: string,
  ) {
    return this.orderItemService.cancelOrderItemById(
      id,
      cancelReasonData,
      staffId,
    );
  }
  @Delete('lock/:id')
  lockOrderItemById(@Param('id') id: string) {
    return this.orderItemService.lockOrderItemById(id);
  }
}
