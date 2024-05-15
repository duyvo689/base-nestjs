import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CancelReasonService } from './cancel-reason.service';
import { CreateCancelReasonDto } from './dto/create-cancel-reason.dto';
import { UpdateCancelReasonDto } from './dto/update-cancel-reason.dto';

@Controller('cancel-reason')
export class CancelReasonController {
  constructor(private readonly cancelReasonService: CancelReasonService) {}

  @Post()
  create(@Body() createCancelReasonDto: CreateCancelReasonDto) {
    return this.cancelReasonService.create(createCancelReasonDto);
  }

  @Get()
  findAll() {
    return this.cancelReasonService.findAll();
  }

}
