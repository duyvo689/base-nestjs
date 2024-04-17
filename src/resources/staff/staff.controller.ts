import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetStaff } from 'src/configs/decorators';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}


  // Thông tin của nhân viên account
  @UseGuards(AuthGuard)
  @Get('/my-profile')
  getProfileStaffById(@GetStaff('sub') staffId: string) {
    return this.staffService.getProfileStaffById(staffId);
  }
}
