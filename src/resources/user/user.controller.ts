import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GetStaff } from 'src/configs/decorators';
import { CreateUserMaybeBookingDto } from './dto/create-user-maybe-booking.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('maybe-booking')
  createMaybeBooking(
    @GetStaff('sub') staffId: string,
    @Body() createUserMaybeBookingDto: any,
  ) {
    return this.userService.createMaybeBooking(
      staffId,
      createUserMaybeBookingDto,
    );
  }

  @Get()
  findAll(
    //pagination
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '20',
    //filters
    @Query('rankIds') rankIds?: string[],
    @Query('clinicIds') clinicIds?: string[],
    @Query('active') active?: string,
  ) {
    const filters = {
      ...(active ? { active: active } : { active: 'ACTIVE' }),
      ...(rankIds && { rankId: { in: rankIds } }),
      ...(clinicIds && { clinicId: { in: clinicIds } }),
    };

    return this.userService.findAll(filters,+skip,+take);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetStaff() staff: any) {
    return this.userService.findOne(id, staff);
  }
}
