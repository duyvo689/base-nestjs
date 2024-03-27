import { Body, Controller, Post } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { LogService } from './log.service';

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Post('')
  createLog(@Body() createLogDto: CreateLogDto) {
    return this.logService.createLog(createLogDto);
  }
}
