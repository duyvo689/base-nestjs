import { Injectable } from '@nestjs/common';
import { CreateCancelReasonDto } from './dto/create-cancel-reason.dto';
import { UpdateCancelReasonDto } from './dto/update-cancel-reason.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CancelReasonService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createCancelReasonDto: CreateCancelReasonDto) {
    return 'This action adds a new cancelReason';
  }

  async findAll() {
    const resons = await this.prismaService.cancelReason.findMany({
      where: {
        active: 'ACTIVE',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return resons;
  }
}
