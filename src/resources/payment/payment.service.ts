import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto, staffId: string) {
    try {
      const transactionFn = async (prisma: PrismaClient) => {
        const bill = await prisma.bills.create({
          data: { ...createPaymentDto.bill, creatorId: staffId },
        });
        await prisma.billItems.createMany({
          data: createPaymentDto.billItems.map((item) => ({
            ...item,
          })),
        });
        // Lấy danh sách các billItems từ createPaymentDto
        const billItems = createPaymentDto.billItems;
        // Tạo mảng lưu trữ các promise để cập nhật customerPaid
        const updatePromises = [];
        // Duyệt qua từng billItem để thực hiện các thay đổi
        for (const item of billItems) {
          // Lấy giá trị hiện tại của customerPaid từ orderItem
          const orderItem = await prisma.orderItems.findUnique({
            where: { id: item.orderItemId },
            select: { customerPaid: true },
          });
          // Tính toán giá trị mới cho customerPaid
          const newCustomerPaid = orderItem.customerPaid + item.paid;
          // Cập nhật customerPaid
          const updatePromise = prisma.orderItems.update({
            where: { id: item.orderItemId },
            data: { customerPaid: newCustomerPaid },
          });
          // Thêm promise vào mảng
          updatePromises.push(updatePromise);
        }

        // Chờ cho tất cả các promise cập nhật customerPaid hoàn thành
        await Promise.all(updatePromises);

        return bill;
      };

      const bill = await this.prismaService.$transaction(transactionFn);
      return bill;
    } catch (error) {
      console.log('🚀 ~ PaymentService ~ create ~ error:', error);
    }
  }

  async findBillHistoryByUser(userId: string) {
    const bills = await this.prismaService.bills.findMany({
      where: { userId },
      include: {
        clinic: {
          select: {
            id: true,
            name: true,
            shortName: true,
            address: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        paymentMethod: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        billItems: {
          include: {
            orderItem: true,
          },
        },
      },
      orderBy: {
        recordingDate: 'desc',
      },
    });
    console.log('🚀 ~ PaymentService ~ findBillHistoryByUser ~ bills:', bills);

    return bills;
  }

  async findOrderItemsStillDebt(userId: string) {
    const orderItems = await this.prismaService.$queryRaw`
      SELECT *
      FROM "orderItems"
      WHERE (price * quantity - discount - "customerPaid") > 0 and "userId"::text = ${userId} and "isCancel" = false and "isLock" = false
      ORDER BY "createdAt" DESC;
    `;
    return orderItems;
  }

  async deleteBillById(id: string) {
    const transactionFn = async (prisma: PrismaClient) => {

      const billItems = await prisma.billItems.findMany({
        where: { billId: id },
        select: {
          paid: true,
          orderItemId: true,
          orderItem: {
            select:{
              customerPaid:true
            }
          },
        },
      });
      if (!billItems || billItems.length == 0) {
        throw new NotFoundException();
      }
      const updatePromises = [];
      // Duyệt qua từng billItem để thực hiện các thay đổi
      for (const item of billItems) {
        // Tính toán giá trị mới cho customerPaid
        const newCustomerPaid = item.orderItem.customerPaid - item.paid;
        // Cập nhật customerPaid
        const updatePromise = prisma.orderItems.update({
          where: { id: item.orderItemId },
          data: { customerPaid: newCustomerPaid },
        });
        // Thêm promise vào mảng
        updatePromises.push(updatePromise);
      }
      await Promise.all(updatePromises);

      await prisma.billItems.deleteMany({
        where: { billId: id },
      });

      await prisma.bills.delete({
        where: { id: id },
      });
      return id
    };

    const bill = await this.prismaService.$transaction(transactionFn);
    console.log("🚀 ~ PaymentService ~ transactionFn ~ id:", bill)

    return bill;
  }
}
