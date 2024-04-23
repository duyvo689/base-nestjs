import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MarketingTeamService } from './marketing-team.service';
import { CreateMarketingTeamDto } from './dto/create-marketing-team.dto';
import { UpdateMarketingTeamDto } from './dto/update-marketing-team.dto';

@Controller('marketing-team')
export class MarketingTeamController {
  constructor(private readonly marketingTeamService: MarketingTeamService) {}

  @Post()
  create(@Body() createMarketingTeamDto: CreateMarketingTeamDto) {
    return this.marketingTeamService.create(createMarketingTeamDto);
  }

  @Get()
  findAll() {
    return this.marketingTeamService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marketingTeamService.remove(id);
  }
}
