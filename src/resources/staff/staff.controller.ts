import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
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
    console.log("🚀 ~ StaffController ~ getProfileStaffById ~ staffId:", staffId)
    return this.staffService.getProfileStaffById(staffId);
  }

  @Get('')
  findAll(
    @Query('roleIds') roleIds?: string[],
    @Query('clinicIds') clinicIds?: string[],
    @Query('active') active?: string,
  ) {
    const filters = {
      ...(active ? { active: active } : { active: 'ACTIVE' }),
      ...(roleIds && { roleId: { in: roleIds } }),
      ...(clinicIds && {
        staffClinices: {
          some: {
            clinicId: {
              in: clinicIds,
            },
          },
        },
      }),
    };
    return this.staffService.findAll(filters);
  }

  @Post()
  create(@Body() staff: any) {
    return this.staffService.create(staff);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.staffService.delete(id);
  }
}
