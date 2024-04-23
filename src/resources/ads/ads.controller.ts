import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AdsService } from './ads.service';
import { CreateAdDto } from './dto/create-ad.dto';

@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Post()
  create(@Body() createAdDto: CreateAdDto) {
    return this.adsService.create(createAdDto);
  }

  @Get()
  findAll() {
    return this.adsService.findAll();
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adsService.remove(id);
  }
}
