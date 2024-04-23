import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class RoleService {
  constructor(private prismaService: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      const transactionFn = async (prisma: PrismaClient) => {
        //tạo role
        const role = await prisma.roles.create({
          data: {
            shortName: createRoleDto.shortName,
            displayName: createRoleDto.displayName,
          },
        });
        //tìm các permission có shortName trong mảng permissions để lấy id
        const permissions = await prisma.permissions.findMany({
          where: {
            shortName: {
              in: [...createRoleDto.permissions],
            },
          },
        });
        //tạo rolePermission
        const rolePermissions = permissions.map((permission) => {
          return {
            roleId: role.id,
            permissionId: permission.id,
          };
        });
        //tạo rolePermission
        await prisma.rolePermission.createMany({
          data: rolePermissions,
        });
        return role;
      };
      const role = await this.prismaService.$transaction(transactionFn);
      return role;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll() {
    try {
      const roles = await this.prismaService.roles.findMany({
        where: {
          active: 'ACTIVE',
        },
        include: {
          rolePermission: {
            select: {
              permission: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return roles;
    } catch (error) {}
  }

  async update(roleId: string, updateRoleDto: UpdateRoleDto) {
    try {
      const transactionFn = async (prisma: PrismaClient) => {
        const role = await prisma.roles.findUnique({
          where: {
            id: roleId,
          },
          include: {
            rolePermission: true,
          },
        });
        if (!role) {
          throw new NotFoundException('Không tìm thấy vai trò');
        }
        //cập nhật role
        await prisma.roles.update({
          where: {
            id: roleId,
          },
          data: {
            shortName: updateRoleDto.shortName,
            displayName: updateRoleDto.displayName,
          },
        });

        const p = await prisma.rolePermission.deleteMany({
          where: {
            roleId: role.id,
          },
        });
        console.log('🚀 ~ RoleService ~ transactionFn ~ p:', p);
        //tìm các permission có shortName trong mảng permissions để lấy id
        const permissions = await prisma.permissions.findMany({
          where: {
            shortName: {
              in: [...updateRoleDto.permissions],
            },
          },
        });
        //tạo rolePermission
        const rolePermissions = permissions.map((permission) => {
          return {
            roleId: role.id,
            permissionId: permission.id,
          };
        });
        //tạo rolePermission
        await prisma.rolePermission.createMany({
          data: rolePermissions,
        });
      };
      const role = await this.prismaService.$transaction(transactionFn);
      return role;
    } catch (error) {
      console.log('🚀 ~ RoleService ~ create ~ error:', error);
    }
  }

  async delete(roleId: string) {
    try {
      const role = await this.prismaService.roles.findUnique({
        where: {
          id: roleId,
        },
      });
      
      if (!role) {
        throw new NotFoundException('Không tìm thấy vai trò');
      }

      await this.prismaService.roles.update({
        where: {
          id: roleId,
        },
        data: {
          active: 'DELETE',
        },
      });

      await this.prismaService.rolePermission.deleteMany({
        where: {
          roleId: roleId,
        },
      });
      return `deleted role success ${roleId}`;
    } catch (error) {
      console.log('🚀 ~ RoleService ~ delete ~ error:', error);
    }
  }
}
