import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { getPrefixId, nanoid } from 'src/utils';
import * as dayjs from 'dayjs';

@Injectable()
export class OrderItemService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createOrderItemDto: CreateOrderItemDto[], staffId: string) {
    const items = await this.prismaService.orderItems.createMany({
      data: createOrderItemDto.map((item) => {
        const id = this.createOrderItemId(item.clinicId);
        return {
          ...item,
          id: id,
          customerPaid: 0,
          creatorId: staffId,
          orderId: '123',
        };
      }),
    });
    return 'This action adds a new orderItem';
  }

  async findOrderItemByUser(userId: string) {
    const items = await this.prismaService.orderItems.findMany({
      where: {
        userId: userId,
        // orderId: null,
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
            address:true
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return items;
  }

  async cancelOrderItemById(
    id: string,
    cancelReasonData: any,
    staffId: string,
  ) {
    const itemF = await this.prismaService.orderItems.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        isCancel: true,
      },
    });
    if (!itemF) {
      throw new NotFoundException();
    }

    const item = await this.prismaService.orderItems.update({
      data: {
        isCancel: true,
      },
      where: { id: id },
    });

    const duy = await this.prismaService.cancelReasonOfItem.createMany({
      data: cancelReasonData.map((item) => ({ ...item, creatorId: staffId })),
    });
    return item;
  }

  async lockOrderItemById(id: string) {
    const itemF = await this.prismaService.orderItems.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        isLock: true,
      },
    });
    if (!itemF) {
      throw new NotFoundException();
    }

    const item = await this.prismaService.orderItems.update({
      data: {
        isLock: !itemF.isLock,
      },
      where: { id: id },
    });

    return item;
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
