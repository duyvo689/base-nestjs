import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentMethodService {
  constructor(private readonly prismaService: PrismaService) {}
  async findAll() {
    const methods = await this.prismaService.paymentMethod.findMany({
      where: {
        active: 'ACTIVE',
      },
      orderBy: {
        sorting: 'asc',
      },
    });
    return methods;
  }
}
