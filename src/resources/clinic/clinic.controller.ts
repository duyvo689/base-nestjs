import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';

@Controller('clinic')
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @Post()
  create(@Body() createClinicDto: CreateClinicDto) {
    console.log("🚀 ~ ClinicController ~ create ~ createClinicDto:", createClinicDto)
    return this.clinicService.create(createClinicDto);
  }

  @Get()
  findAll() {
    return this.clinicService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clinicService.remove(id);
  }
}
