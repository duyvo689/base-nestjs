import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dayjs from 'dayjs';
import { ACADEMY_ID, DENTAL_ID } from 'src/constant';
import { getPrefixId, nanoid } from 'src/utils';

@Injectable()
export class BookingService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createBookingDto: CreateBookingDto, staffId: string) {
    try {
      const bookingId = this.createBookingId(createBookingDto.clinicId);
      const { serviceIds, userCustomId, ...data } = createBookingDto;
      const bookings = await this.prismaService.bookings.create({
        data: { ...data, id: bookingId, creatorId: staffId },
      });
      if (
        createBookingDto?.serviceIds &&
        createBookingDto?.serviceIds.length > 0
      ) {
        await this.prismaService.bookingServices.createMany({
          data: createBookingDto.serviceIds.map((item) => ({
            serviceId: item,
            bookingId: bookingId,
          })),
        });
      }
      return bookings;
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return `This action returns all booking`;
  }

  async findBookingByUser(userId: string) {
    const bookings = await this.prismaService.bookings.findMany({
      where: {
        userId: userId,
      },
      include: {
        bookingServices: {
          select: {
            service: { select: { name: true, id: true, customId: true } },
          },
        },
        doctor: {
          select: { name: true },
        },
        technician: {
          select: { name: true, id: true },
        },
        creator: {
          select: { name: true, id: true },
        },
        leftReason: {
          select: { name: true, id: true },
        },
        cancelReason: { select: { name: true, id: true } },
      },
      orderBy: {
        appointmentDate: 'desc',
      },
    });
    return bookings;
  }

  createBookingId(clinicId: string) {
    const number = nanoid();
    const f = getPrefixId(clinicId);
    const date = dayjs().format('DDMMYY');
    let ff = `BK${f}`;
    return `${ff}${date}-${number}`;
  }
}
