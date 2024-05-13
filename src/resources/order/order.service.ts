import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { getPrefixId, nanoid } from 'src/utils';
import * as dayjs from 'dayjs';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, staffId: string) {
    const orderId = this.createOrderId(createOrderDto.order.clinicId);
    if (!orderId) {
      throw new Error('Failed to create an order ID.');
    }
    const transactionFn = async (prisma: PrismaClient) => {
      const order = await prisma.orders.create({
        data: { ...createOrderDto.order, creatorId: staffId, id: orderId },
      });
      await prisma.orderItems.createMany({
        data: createOrderDto.orderItems.map((item) => ({
          ...item,
          orderId: order.id,
          creatorId: staffId,
          id: this.createOrderItemId(createOrderDto.order.clinicId),
        })),
      });
      return order;
    };
    const order = await this.prismaService.$transaction(transactionFn);
    console.log('🚀 ~ OrderService ~ create ~ order:', order);
    return order;
  }

  async findOrderOfUser(userId: string) {
    const orders = await this.prismaService.orders.findMany({
      where: {
        userId: userId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        clinic: {
          select: {
            id: true,
            name: true,
            shortName: true,
          },
        },
        orderItems: {
          include: {
            service: {
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
            sellerOnline: {
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
            creator: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const results = await Promise.all(
      orders.map(async (item) => {
        const priceResult = await this.calculatePriceOrder(item.id);
        console.log("🚀 ~ OrderService ~ orders.map ~ priceResult:", priceResult)
        return { ...item, billing: priceResult[0] };
      }),
    );
    return results;
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

  createOrderItemId(clinicId: string) {
    const number = nanoid();
    const f = getPrefixId(clinicId);
    const date = dayjs().format('DDMMYY');
    let ff = `OI${f}`;
    return `${ff}${date}-${number}`;
  }

  async calculatePriceOrder(orderId: string) {
    const res = await this.prismaService.$queryRaw`
    SELECT
    CAST(SUM("price" * "quantity") AS TEXT) AS total,
    CAST(SUM("discount") AS TEXT) AS discount,
    CAST(SUM("customerPaid") AS TEXT) AS paid,
    CAST(SUM("price" * "quantity" - "discount" - "customerPaid") AS TEXT) AS debt
FROM
    "orderItems"
WHERE
    "orderItems"."orderId" = ${orderId}
GROUP BY
    "orderId";
    `;
    return res;
  }
}
