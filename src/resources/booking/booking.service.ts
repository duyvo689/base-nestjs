import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dayjs from 'dayjs';
import { ACADEMY_ID, DENTAL_ID } from 'src/constant';

@Injectable()
export class BookingService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createBookingDto: CreateBookingDto) {
    try {
      const bookingId = this.createBookingId(createBookingDto.userCustomId);
      const { serviceIds, userCustomId, ...data } = createBookingDto;
      const bookings = await this.prismaService.bookings.create({
        data: { ...data, id: bookingId },
      });
      console.log('🚀 ~ BookingService ~ create ~ bookings:', bookings);
      if (
        createBookingDto?.serviceIds &&
        createBookingDto?.serviceIds.length > 0
      ) {
        const duy = await this.prismaService.bookingServices.createMany({
          data: createBookingDto.serviceIds.map((item) => ({
            serviceId: item,
            bookingId: bookingId,
          })),
        });
        console.log('🚀 ~ BookingService ~ create ~ duy:', duy);
      }
      return bookings;
    } catch (error) {
      throw  error;
    }
  }

  findAll() {
    return `This action returns all booking`;
  }

  createBookingId(userCustomId?: string) {
    const date = dayjs().format('DDMMYYmmss');
    let f = 'BK';
    return `${userCustomId}-${f}${date}`;
  }
}
