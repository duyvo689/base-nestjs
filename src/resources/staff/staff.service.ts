import { Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StaffService {
  constructor(private prismaService: PrismaService) {}

  async getProfileStaffById(id: string) {
    try {
      const staff: any = await this.prismaService.staffs.findFirst({
        where: {
          id: id,
          active: {
            notIn: ['DELETE', 'INACTIVE'],
          },
        },
        include: {
          role: true,
        },
      });
      const permissions = await this.prismaService.rolePermission.findMany({
        where: {
          roleId: staff.roleId,
        },
        select: {
          permission: true,
        },
      });

      const clinics = await this.prismaService.staffClinic.findMany({
        where: {
          staffId: staff.id,
          clinic: {
            active: 'ACTIVE',
          },
        },
        select: {
          clinic: true,
        },
      });

      const notEnterPathProjects =
        await this.prismaService.rolePathProject.findMany({
          where: {
            roleId: staff.roleId,
          },
          select: {
            pathProject: true,
          },
        });

      staff.permissions = permissions.map((p) => p.permission.shortName);
      staff.clinics = clinics.map((p) => p.clinic);
      staff.notEnterPathProjects = notEnterPathProjects.map(
        (p) => p.pathProject.path,
      );

      delete staff.hashedPassword;

      return staff;
    } catch (error) {
      console.log('🚀 ~ StaffService ~ getProfileStaffById ~ error:', error);
    }
  }
}
