import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { GetStaff } from 'src/configs/decorators';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto, @GetStaff('sub') staffId:string) {
    return this.bookingService.create(createBookingDto,staffId);
  }

  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @Get('/user')
  findBookingByUser(@Query('userId') userId:string) {
    return this.bookingService.findBookingByUser(userId);
  }

  
}
