import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RankService } from './rank.service';
import { CreateRankDto } from './dto/create-rank.dto';
import { UpdateRankDto } from './dto/update-rank.dto';

@Controller('rank')
export class RankController {
  constructor(private readonly rankService: RankService) {}

  @Post()
  create(@Body() createRankDto: CreateRankDto) {
    return this.rankService.create(createRankDto);
  }

  @Get()
  findAll() {
    return this.rankService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rankService.remove(id);
  }
}
