import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderItemService } from '../order-item/order-item.service';

@Injectable()
export class PaymentService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createPaymentDto: CreatePaymentDto) {
    return 'This action adds a new payment';
  }

  async findOrderItemsStillDebt(userId: string) {
    const orderItems = await this.prismaService.$queryRaw`
      SELECT *
      FROM "orderItems"
      WHERE (price * quantity - discount - "customerPaid") > 0 and "userId" = 'c9f68aa3-f71e-4e89-b786-751b444ae1c3'
      ORDER BY "createdAt" DESC;
    `;
    return orderItems;
  }
}
