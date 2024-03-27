import {
  Controller,
  Get
} from '@nestjs/common';
import * as dayjs from 'dayjs';

@Controller()
export class AppController {
  date = Date();
  @Get()
  getHello(): string {
    const text =
      'deploy at' +
      ' --- ' +
      dayjs(this.date).add(7, 'hour').format('DD/MM/YYYY - HH:mm:ss');

    return text;
  }

  @Get('/current-time-server')
  getCurrentTime() {
    return dayjs();
  }
}
