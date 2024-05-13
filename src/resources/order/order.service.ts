import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { getPrefixId, nanoid } from 'src/utils';
import * as dayjs from 'dayjs';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  //Tìm những dịch vụ của khách hàng đã đặt còn hiệu lực để tiến hàng đặt booking điều trị
  async findServiceOfUserBooked(userId: string) {
    const orderIds = await this.prismaService.orders.findMany({
      where: {
        userId: userId,
        NOT: {
          lockStatus: 'LOCK',
          activeStatus: 'CANCEL',
        },
      },
      select: { id: true },
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (!orderIds || orderIds.length == 0) {
      return [];
    }
    const orderItems = await this.prismaService.orderItems.findMany({
      where: {
        orderId: {
          in: orderIds.map((item) => item.id),
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        sellerOnline: {
          select: {
            id: true,
            name: true,
          },
        },
        sellerOffline: {
          select: {
            id: true,
            name: true,
          },
        },
        salesSupport: {
          select: {
            id: true,
            name: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            customId: true,
          },
        },
      },
    });

    return orderItems;
  }

  createOrderId(clinicId: string) {
    const number = nanoid();
    const f = getPrefixId(clinicId);
    const date = dayjs().format('DDMMYY');
    let ff = `O${f}`;
    return `${ff}${date}-${number}`;
  }
}
