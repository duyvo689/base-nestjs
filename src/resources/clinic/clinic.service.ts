import { Injectable } from '@nestjs/common';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClinicService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createClinicDto: CreateClinicDto) {
    const clinic = await this.prismaService.clinics.create({
      data: createClinicDto,
    });
    return clinic;
  }

  async findAll() {
    const clinics = await this.prismaService.clinics.findMany({
      where: {
        active: 'ACTIVE',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return clinics;
  }

  async remove(id: string) {
    await this.prismaService.clinics.update({
      where: {
        id: id,
      },
      data: {
        active: 'DELETE',
      },
    });
    return `This action removes a #${id} clinic`;
  }
}
