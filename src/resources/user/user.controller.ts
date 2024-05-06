import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from '@nestjs/common';
import { GetStaff } from 'src/configs/decorators';
import { CreateUserMaybeBookingDto } from './dto/create-user-maybe-booking.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('maybe-booking')
  createMaybeBooking(@GetStaff('sub') staffId:string,
    @Body() createUserMaybeBookingDto: any,
  ) {
    return this.userService.createMaybeBooking(staffId,createUserMaybeBookingDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetStaff() staff: any) {
    return this.userService.findOne(id, staff);
  }
}
