import {
  Body,
  Controller,
  Post
} from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { LarkBaseService } from './lark-base.service';

@Controller('lark-base')
export class LarkBaseController {
  constructor(private readonly larkBitableService: LarkBaseService) {}

  @Post('/create-record')
  create(@Body() createRecordDto: CreateRecordDto) {
    return this.larkBitableService.createRecordBase(createRecordDto);
  }
}
