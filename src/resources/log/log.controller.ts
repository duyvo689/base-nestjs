import { Body, Controller, Post } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { LogService } from './log.service';
import { GetStaff } from 'src/configs/decorators';

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Post('')
  createLog(@Body() createLogDto: CreateLogDto, @GetStaff() staff:any) {
    return this.logService.createLog(createLogDto, staff);
  }
}
