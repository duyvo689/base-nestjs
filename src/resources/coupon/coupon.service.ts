import { Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CouponService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createCouponDto: CreateCouponDto) {
    try {
      const { couponApplyAtClinic, couponApplyServices, ...couponData } =
        createCouponDto;
      const transactionFn = async (prisma: PrismaClient) => {
        const coupons = await prisma.coupons.create({
          data: couponData,
        });

        if (couponApplyAtClinic) {
          await prisma.couponApplyAtClinic.createMany({
            data: couponApplyAtClinic.map((clinicId) => ({
              couponId: coupons.id,
              clinicId: clinicId,
            })),
          });
        }
        if (couponApplyServices) {
          await prisma.couponApplyServices.createMany({
            data: couponApplyServices.map((service) => ({
              ...service,
              couponId: coupons.id,
            })),
          });
        }
      };
      const coupons = await this.prismaService.$transaction(transactionFn);
      return coupons;
    } catch (error) {
      console.log(error);
      throw Error(error);
    }
  }

  async findAll() {
    const coupons = await this.prismaService.coupons.findMany({
      where: {
        active: 'ACTIVE',
      },
      include: {
        couponApplyAtClinics: true,
        couponApplyServices: true,
      },
    });
    return coupons;
  }

  async remove(id: string) {
    const transactionFn = async (prisma: PrismaClient) => {
      await prisma.coupons.update({
        where: {
          id,
        },
        data: {
          active: 'DELETE',
        },
      });
      await prisma.couponApplyAtClinic.deleteMany({
        where: {
          couponId: id,
        },
      });
      await prisma.couponApplyServices.deleteMany({
        where: {
          couponId: id,
        },
      });
    };
    await this.prismaService.$transaction(transactionFn);
    return `This action removes a #${id} coupon`;
  }
}
