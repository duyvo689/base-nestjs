import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ServiceService {
  constructor(private prismaService: PrismaService) {}

  async create(createServiceDto: CreateServiceDto) {
    const {clinicIds,...data}=createServiceDto
    const service = await this.prismaService.services.create({
      data: data,
    });

    if (clinicIds && clinicIds.length > 0) {
      await this.prismaService.serviceApplyClinic.createMany({
        data: clinicIds.map((item) => ({
          serviceId: service.id,
          clinicId: item,
        })),
      });
    }
    return service;
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
      where: {
        active: 'ACTIVE',
      },
      orderBy: {
        name: 'asc',
      },
    });
    const services = await this.prismaService.services.findMany({
      where: {
        active: 'ACTIVE',
      },
      include: {
        category: true,
      },
      orderBy: {
        categoryId: 'asc',
      },
    });

    return {
      categoryTags,
      categories,
      services,
    };
  }

  async findServiceByStaffClinic(staffId: string) {
    const resClinicIds = await this.prismaService.staffClinic.findMany({
      where: {
        staffId: staffId,
      },
      select: {
        clinicId: true,
      },
    });

    let services = [];
    if (resClinicIds && resClinicIds.length > 0) {
      const clinicIds = resClinicIds.map((item) => item.clinicId);
      services = await this.prismaService.services.findMany({
        where: {
          active: 'ACTIVE',
          serviceApplyClinic: {
            some: {
              clinicId: {
                in: clinicIds,
              },
            },
          },
        },
        include: {
          category: true,
        },
        orderBy: {
          name: 'asc',
        },
      });
    }
    return services
  }

  remove(id: number) {
    return `This action removes a #${id} service`;
  }
}
