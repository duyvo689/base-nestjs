import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';
import { relative } from 'node:path/win32';
import * as argon from 'argon2';

@Injectable()
export class StaffService {
  constructor(private prismaService: PrismaService) {}

  async getProfileStaffById(id: string) {
    try {
      const staff: any = await this.prismaService.staffs.findFirst({
        where: {
          id: id,
          active: 'ACTIVE',
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

  async create(staff: CreateStaffDto) {
    try {
      const { clinicIds, ..._staff } = staff;
      const transactionFn = async (prisma: PrismaClient) => {
        const hashedPassword = await argon.hash(_staff.phone);
        const newStaff = await prisma.staffs.create({
          data: {
            ..._staff,
            hashedPassword,
            active: 'ACTIVE',
          },
        });

        await prisma.staffClinic.createMany({
          data: clinicIds.map((clinicId) => {
            return {
              staffId: newStaff.id,
              clinicId: clinicId,
            };
          }),
        });
        return newStaff;
      };
      const newStaff = await this.prismaService.$transaction(transactionFn);
      return newStaff;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(`Đã tồn tại ${error.meta.target}`);
      }
    }
  }

  async findAll(filters: any) {
    const staffs = await this.prismaService.staffs.findMany({
      where: filters,
      include: {
        role: true,
        staffClinices: {
          select: {
            clinic: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return staffs;
  }

  async update(id: string) {}

  async delete(id: string) {
    try {
      const staff = await this.prismaService.staffs.findUnique({
        where: {
          id: id,
        },
      });

      if (!staff) {
        throw new NotFoundException('Không tìm thấy vai trò');
      }
      const transactionFn = async (prisma: PrismaClient) => {
        await this.prismaService.staffs.update({
          where: {
            id: id,
          },
          data: {
            active: 'DELETE',
          },
        });

        await this.prismaService.staffClinic.deleteMany({
          where: {
            staffId: id,
          },
        });
      };
      await this.prismaService.$transaction(transactionFn);
      return `deleted staff success ${id}`;
    } catch (error) {
      throw error;
    }
  }
}
