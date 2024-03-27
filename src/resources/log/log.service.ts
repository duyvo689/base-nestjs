import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReadlogDto } from './dto/create-readlog.dto';
import { CreateLogDto } from './dto/create-log.dto';

@Injectable()
export class LogService {
  constructor(private readonly prismaService: PrismaService) {}

  async createLog(createLogDto: CreateLogDto) {
    await this.prismaService.functionLogs.create({
      data: {
        ...createLogDto,
      },
    });
    return 'done';
  }

}
