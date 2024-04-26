import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ServiceService {
  constructor(private prismaService: PrismaService) {}

  create(createServiceDto: CreateServiceDto) {
    return 'This action adds a new service';
  }

  async findAll() {
    const tags = await this.prismaService.categories.groupBy({
      by: ['categoryTag'],
      where: {
        active: 'ACTIVE',
      },
      orderBy: {
        categoryTag: 'asc',
      },
    });

    const categoryTags = tags.map((tag) => tag.categoryTag);

    const categories = await this.prismaService.categories.findMany({
      where:{
        active: 'ACTIVE'
      },
      orderBy:{
        name: 'asc'
      }
    })
    const services = await this.prismaService.services.findMany({
      where:{
        active: 'ACTIVE'
      },
      include:{
        category:true
      },
      orderBy:{
        categoryId: 'asc',
      }
    })

    return {
      categoryTags,
      categories,
      services,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} service`;
  }

  update(id: number, updateServiceDto: UpdateServiceDto) {
    return `This action updates a #${id} service`;
  }

  remove(id: number) {
    return `This action removes a #${id} service`;
  }
}
