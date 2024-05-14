import { Injectable } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { getPrefixId, nanoid } from 'src/utils';
import * as dayjs from 'dayjs';

@Injectable()
export class OrderItemService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createOrderItemDto: CreateOrderItemDto) {
    return 'This action adds a new orderItem';
  }

  async findOrderItemByUser(userId: string) {
    const items = await this.prismaService.orderItems.findMany({
      where: {
        userId: userId,
        orderId: null,
      },
      include: {
        service: {
          select: {
            id: true,
            customId: true,
            name: true,
          },
        },
        sellerOnline: {
          select: {
            id: true,
            customId: true,
            name: true,
          },
        },
        sellerOffline: {
          select: {
            id: true,
            customId: true,
            name: true,
          },
        },
        salesSupport: {
          select: {
            id: true,
            customId: true,
            name: true,
          },
        },
        creator: {
          select: {
            id: true,
            customId: true,
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
      },
    });
    return items;
  }

  async findOrderGroupByUser(userId: string) {
    const items = await this.prismaService.orderItems.findMany({
      where: {
        userId: userId,
        orderId: { not: null },
      },
      include: {
        service: {
          select: {
            id: true,
            customId: true,
            name: true,
          },
        },
        sellerOnline: {
          select: {
            id: true,
            customId: true,
            name: true,
          },
        },
        sellerOffline: {
          select: {
            id: true,
            customId: true,
            name: true,
          },
        },
        salesSupport: {
          select: {
            id: true,
            customId: true,
            name: true,
          },
        },
        creator: {
          select: {
            id: true,
            customId: true,
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
      },
    });

    if (items.length == 0) return [];
    // const groupedOrders = items.reduce((acc, order) => {
    //   if (!acc[order.orderId]) {
    //     acc[order.orderId] = [];
    //   }
    //   acc[order.orderId].push(order);
    //   return acc;
    // }, {});

    const groupedOrders = items.reduce((acc, order) => {
      const key = `${order.orderId}-${order.clinicId}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(order);
      return acc;
    }, {});

    const result = Object.values(groupedOrders).map(items => ({
      orderId: items[0].orderId,
      items: items
    }));

    const results = await Promise.all(
      result.map(async (item) => {
        const priceResult = await this.calculatePriceOrder(item.orderId);
        return { ...item, billing: priceResult[0] };
      }),
    );
    return results;
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
