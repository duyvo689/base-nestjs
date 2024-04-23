import { Injectable } from '@nestjs/common';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdsService {
  constructor(private readonly prismaService: PrismaService) {}

  
  async create(createAdDto: CreateAdDto) {
    const advertises = await this.prismaService.advertises.create({
      data: createAdDto,
    });
    return advertises;
  }

  async findAll() {
    const advertises = await this.prismaService.advertises.findMany({
      where: {
        active: 'ACTIVE',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return advertises;
  }

  async remove(id: string) {
    await this.prismaService.advertises.update({
      where: {
        id: id,
      },
      data: {
        active: 'DELETE',
      },
    });
    return `This action removes a #${id} ads`;
  }
}
