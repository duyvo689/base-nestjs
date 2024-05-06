import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { BookingService } from '../booking/booking.service';
import { RankService } from '../rank/rank.service';

@Module({
  controllers: [UserController],
  providers: [UserService, BookingService, RankService],
})
export class UserModule {}
