import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingService } from '../booking/booking.service';
import { CreateUserMaybeBookingDto } from './dto/create-user-maybe-booking.dto';
import * as dayjs from 'dayjs';
import { RankService } from '../rank/rank.service';
import { PrismaClient } from '@prisma/client';
import { getPrefixId, nanoid } from 'src/utils';

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
        const customId = this.createUserCustomId(
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

        let findOldUser = [];

        if (createUserMaybeBookingDto.user?.phone) {
          const findOldUserByPhone = await prisma.users.findMany({
            where: {
              OR: [
                {
                  phone: createUserMaybeBookingDto.user?.phone,
                },
                {
                  phone2: createUserMaybeBookingDto.user?.phone,
                },
              ],
            },
            select: {
              name: true,
              phone: true,
              phone2: true,
              customId: true,
              avatar: true,
            },
          });

          if (findOldUserByPhone && findOldUserByPhone.length > 0) {
            findOldUser = [...findOldUser, ...findOldUserByPhone];
          }
        }
        if (createUserMaybeBookingDto.user?.phone2) {
          const findOldUserByPhone2 = await prisma.users.findMany({
            where: {
              OR: [
                {
                  phone: createUserMaybeBookingDto.user?.phone2,
                },
                {
                  phone2: createUserMaybeBookingDto.user?.phone2,
                },
              ],
            },
            select: {
              name: true,
              phone: true,
              phone2: true,
              customId: true,
              avatar: true,
            },
          });
          if (findOldUserByPhone2 && findOldUserByPhone2.length > 0) {
            findOldUser = [...findOldUser, ...findOldUserByPhone2];
          }
        }

        if (createUserMaybeBookingDto.user?.email) {
          const findOldUserByEmail = await prisma.users.findUnique({
            where: {
              email: createUserMaybeBookingDto.user?.email,
            },
            select: {
              name: true,
              phone: true,
              phone2: true,
              customId: true,
              avatar: true,
            },
          });
          if (findOldUserByEmail) {
            findOldUser.push(findOldUserByEmail);
          }
        }

        if (findOldUser.length > 0) {
          return findOldUser;
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
            userId: user.id,
          },staffId);
        }
        return user;
      };
      const user = await this.prismaService.$transaction(transactionFn);

      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(`Đã tồn tại ${error.meta.target}`);
      }
      throw error;
    }
  }

  async findAll(filters: any, skip: number, take: number) {
    const users = await this.prismaService.users.findMany({
      where: filters,
      orderBy: {
        createdAt: 'desc',
      },
      skip: skip,
      take: take,
      include: {
        rank: true,
        clinic: true,
        creator: true,
        sellerOnline: true,
      },
    });
    console.log("🚀 ~ UserService ~ findAll ~ users:", users)
    return users;
  }

  findOne(id: string, staff: any) {
    return `This action returns a #${id} user`;
  }

  createUserCustomId(clinicId?: string) {
    const number = nanoid();
    const date = dayjs().format('DDMMYY');
    const f = getPrefixId(clinicId);
    return `${f}${date}-${number}`;
  }
}
