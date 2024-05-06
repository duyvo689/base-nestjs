import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingService } from '../booking/booking.service';
import { CreateUserMaybeBookingDto } from './dto/create-user-maybe-booking.dto';
import * as dayjs from 'dayjs';
import { RankService } from '../rank/rank.service';
import { PrismaClient } from '@prisma/client';
import { ACADEMY_ID, DENTAL_ID } from 'src/constant';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bookingService: BookingService,
    private readonly rankService: RankService,
  ) {}

  async createMaybeBooking(
    staffId,
    createUserMaybeBookingDto: CreateUserMaybeBookingDto,
  ) {
    try {
      const transactionFn = async (prisma: PrismaClient) => {
        const customId = await this.createUserCustomId(
          createUserMaybeBookingDto.user?.clinicId,
        );
        const rank = await prisma.ranks.findFirst({
          where: {
            name: 'Members',
            active: 'ACTIVE',
          },
          select: {
            id: true,
          },
        });
        if (!rank) {
          await this.rankService.create({
            name: 'Members',
            expenseAmount: 100000,
            convertPoints: 1,
            maxPoints: 99,
            minPoints: 99,
          });
        }
        const user = await prisma.users.create({
          data: {
            ...createUserMaybeBookingDto.user,
            customId,
            creatorId: staffId,
            rankId: rank.id,
          },
        });

        if (
          createUserMaybeBookingDto?.booking &&
          createUserMaybeBookingDto?.booking?.appointmentDate
        ) {
          await this.bookingService.create({
            ...createUserMaybeBookingDto?.booking,
            userCustomId: user.customId,
            creatorId: staffId,
            userId:user.id
          });
        }
        return user;
      };
      const user = await this.prismaService.$transaction(transactionFn);
      console.log('🚀 ~ UserService ~ user:', user);

      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(`Đã tồn tại ${error.meta.target}`);
      }
      throw new error();
    }
  }

  async findAll() {
    const users = await this.prismaService.users.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return users;
  }

  findOne(id: string, staff: any) {
    return `This action returns a #${id} user`;
  }

  async createUserCustomId(clinicId?: string) {
    let count = dayjs().format('mmss');

    const countUser: any = await this.prismaService.$queryRaw`
    SELECT COUNT(*)
    FROM users
    WHERE DATE_TRUNC('day', "users"."createdAt") = DATE_TRUNC('day', CURRENT_TIMESTAMP);
`;
    if (countUser && countUser.length > 0) {
      count = countUser[0].count;
      if (countUser[0].count < 10) {
        count = `00${count}`;
      } else if (9 < countUser[0].count && countUser[0].count < 100) {
        count = `0${count}`;
      }
    }
    const date = dayjs().format('DDMMYY');
    let f = 'KH';
    if (DENTAL_ID == clinicId) {
      f = 'NK';
    } else if (ACADEMY_ID == clinicId) {
      f = 'DT';
    } else if (clinicId) {
      f = 'TM';
    }
    return `${f}${date}-${count}`;
  }
}
